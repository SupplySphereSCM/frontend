import { useCallback, useState } from "react";
// @mui
import { alpha } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
// routes
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";
import { useGetService } from "src/api/service";
// components
import Iconify from "src/components/iconify";
import EmptyContent from "src/components/empty-content";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
//
import CartIcon from "../common/cart-icon";
import ServiceDetailsReview from "../service-details-review";
import { ServiceDetailsSkeleton } from "../service-skeleton";
import ServiceDetailsSummary from "../service-details-summary";
import ServiceDetailsCarousel from "../service-details-carousel";
import ServiceDetailsDescription from "../service-details-description";
import { useCheckoutContext } from "../../checkout/context";

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: "100% Original",
    description: "Chocolate bar candy canes ice cream toffee cookie halvah.",
    icon: "solar:verified-check-bold",
  },
  {
    title: "10 Day Replacement",
    description: "Marshmallow biscuit donut dragée fruitcake wafer.",
    icon: "solar:clock-circle-bold",
  },
  {
    title: "Year Warranty",
    description: "Cotton candy gingerbread cake I love sugar sweet.",
    icon: "solar:shield-check-bold",
  },
];

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ServiceShopDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const checkout = useCheckoutContext();

  const [currentTab, setCurrentTab] = useState("description");

  const { service, serviceLoading, serviceError } = useGetService(id);

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    [],
  );

  const renderSkeleton = <ServiceDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${serviceError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.service.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderService = service && (
    <>
      <CustomBreadcrumbs
        links={[
          { name: "Home", href: "/" },
          {
            name: "Shop",
            href: paths.service.root,
          },
          { name: service?.name },
        ]}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ServiceDetailsCarousel service={service} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <ServiceDetailsSummary
            service={service}
            items={checkout.items}
            onAddCart={checkout.onAddToCart}
            onGotoStep={checkout.onGotoStep}
          />
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: "center", px: 5 }}>
            <Iconify
              icon={item.icon}
              width={32}
              sx={{ color: "primary.main" }}
            />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
            {
              value: "description",
              label: "Description",
            },
            // {
            //   value: "reviews",
            //   label: `Reviews (${service.reviews.length})`,
            // },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === "description" && (
          <ServiceDetailsDescription description={service?.description} />
        )}

        {/* {currentTab === "reviews" && (
          <ServiceDetailsReview
            ratings={service.ratings}
            reviews={service.reviews}
            totalRatings={service.totalRatings}
            totalReviews={service.totalReviews}
          />
        )} */}
      </Card>
    </>
  );

  return (
    <Container
      maxWidth={settings.themeStretch ? false : "lg"}
      sx={{
        mt: 5,
        mb: 15,
      }}
    >
      <CartIcon totalItems={checkout.totalItems} />

      {serviceLoading && renderSkeleton}

      {serviceError && renderError}

      {service && renderService}
    </Container>
  );
}
