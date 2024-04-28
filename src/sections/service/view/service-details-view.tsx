import { useEffect, useCallback, useState } from "react";
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
// _mock
import { PRODUCT_PUBLISH_OPTIONS } from "src/_mock";
// routes
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";
// api
import { useGetService } from "src/api/service";
// components
import Iconify from "src/components/iconify";
import EmptyContent from "src/components/empty-content";
import { useSettingsContext } from "src/components/settings";
//
import { ServiceDetailsSkeleton } from "../service-skeleton";
import ServiceDetailsReview from "../service-details-review";
import ServiceDetailsSummary from "../service-details-summary";
import ServiceDetailsToolbar from "../service-details-toolbar";
import ServiceDetailsCarousel from "../service-details-carousel";
import ServiceDetailsDescription from "../service-details-description";

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

export default function ServiceDetailsView({ id }: Props) {
  const { service, serviceLoading, serviceError } = useGetService(id);
  // const service = useGetService(id);

  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState("description");

  const [publish, setPublish] = useState("");
  console.log(service);

  // useEffect(() => {
  //   if (service) {
  //     setPublish(service?.publish);
  //   }
  // }, [service]);

  // const handleChangePublish = useCallback((newValue: string) => {
  //   setPublish(newValue);
  // }, []);

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
          href={paths.dashboard.service.root}
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
      <ServiceDetailsToolbar
        backLink={paths.dashboard.service.root}
        editLink={paths.dashboard.service.edit(`${service?.id}`)}
        liveLink={paths.dashboard.service.details(`${service?.id}`)}
        // publish={publish || ""}
        // onChangePublish={handleChangePublish}
        // publishOptions={PRODUCT_PUBLISH_OPTIONS}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ServiceDetailsCarousel service={service} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <ServiceDetailsSummary disabledActions service={service} />
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
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {serviceLoading && renderSkeleton}

      {serviceError && renderError}

      {service && renderService}
    </Container>
  );
}
