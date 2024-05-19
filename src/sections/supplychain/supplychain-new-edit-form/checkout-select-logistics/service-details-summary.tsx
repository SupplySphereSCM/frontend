import { useEffect, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
// @mui
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";

import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import { formHelperTextClasses } from "@mui/material/FormHelperText";
// routes
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
// utils
import { fShortenNumber, fCurrency } from "src/utils/format-number";
// components
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import Markdown from "src/components/markdown";
import { ColorPicker } from "src/components/color-utils";
import FormProvider, { RHFSelect } from "src/components/hook-form";
// types
import { ITransporterServiceItem } from "src/types/service";
import { ICheckoutItem } from "src/types/checkout";
//
import IncrementerButton from "../../common/incrementer-button";
import { fDate } from "src/utils/format-time";
import { useAuthContext } from "src/auth/hooks";
import { useCheckoutContext } from "../context";
import dashboard from "src/layouts/dashboard";

// ----------------------------------------------------------------------

type Props = {
  service: ITransporterServiceItem;
  disabledActions?: boolean;
};

export default function ServiceDetailsSummary({
  service,
  disabledActions,
  ...other
}: Props) {
  const router = useRouter();
  const {
    eid,
    id,
    name,
    description,
    coverUrl,
    // sizes,
    // images,
    user,
    createdAt,
    updatedAt,
    priceWithinState,
    priceInterState,
    priceInternationl,
    // colors,
    // newLabel,
    // priceSale,
    // saleLabel,
    // totalRatings,
    // totalReviews,
    // inventoryType,
  } = service;

  //   const existService =
  //     !!items?.length && items.map((item) => item.id).includes(id);

  //   const isMaxQuantity =
  //     !!items?.length &&
  //     items.filter((item) => item.id === id).map((item) => item.quantity)[0] >=
  //       available;
  // quantity;

  const defaultValues = {
    eid,
    id,
    name,
    description,
    coverUrl,
    user,
    // available,
    priceWithinState,
    priceInterState,
    priceInternationl,
    // price,
    // colors: colors[0],
    // size: sizes[4],
    // quantity: available < 1 ? 0 : 1,
  };

  const methods = useForm<ICheckoutItem>({
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit } = methods;
  const { onAddLogistics } = useCheckoutContext();

  const values = watch();

  useEffect(() => {
    if (service) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  //   const onSubmit = handleSubmit(async (data: ICheckoutItem) => {
  //     try {
  //       if (!existService) {
  //         onAddCart?.({
  //           ...data,
  //           subTotal: data.price * data.quantity,
  //         } as ICheckoutItem);
  //       }

  //       onGotoStep?.(0);
  //       router.push(paths.service.checkout);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   });

  const handleAddCart = async () => {
    const newLogistics = {
      eid,
      id,
      name,
      // quantity: 1,
      priceWithinState,
      user,
    } as ITransporterServiceItem;
    try {
      onAddLogistics(newLogistics);
      router.push(paths.dashboard.supplychain.new);
    } catch (error) {
      console.error(error);
    }
  };

  //   const renderPrice = (
  //     <Box sx={{ typography: "h5" }}>
  //       {/* {price && (
  //         <Box
  //           component="span"
  //           sx={{
  //             color: "text.disabled",
  //             textDecoration: "line-through",
  //             mr: 0.5,
  //           }}
  //         >
  //           {fCurrency(price)}
  //         </Box>
  //       )} */}

  //       {fCurrency(price)}
  //     </Box>
  //   );

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      <Link
        variant="subtitle2"
        sx={{
          color: "text.secondary",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <Iconify icon="mingcute:add-line" width={16} sx={{ mr: 1 }} />
        Compare
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: "text.secondary",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
        Favorite
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: "text.secondary",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Share
      </Link>
    </Stack>
  );

  const renderContent = (
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
      <Typography variant="h4">{name}</Typography>

      <Markdown children={description} />

      {/* <Stack spacing={2}>
        <Typography variant="h6">Skills</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          {skills.map((skill) => (
            <Chip key={skill} label={skill} variant="soft" />
          ))}
        </Stack>
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h6">Benefits</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          {benefits.map((benefit) => (
            <Chip key={benefit} label={benefit} variant="soft" />
          ))}
        </Stack>
      </Stack> */}
    </Stack>
  );

  const renderOverview = (
    <Stack component={Card} spacing={2} sx={{ p: 3 }}>
      {[
        {
          label: "Date Posted",
          value: fDate(createdAt),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: "Updated date",
          value: fDate(updatedAt),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        // {
        //   label: "Employment type",
        //   value: employmentTypes,
        //   icon: <Iconify icon="solar:clock-circle-bold" />,
        // },
        {
          label: "Price With in State",
          value: fCurrency(priceWithinState),
          icon: <Iconify icon="solar:wad-of-money-bold" />,
        },
        {
          label: "Price Inter State",
          value: fCurrency(priceInterState),
          icon: <Iconify icon="solar:wad-of-money-bold" />,
        },
        {
          label: "Price International",
          value: fCurrency(priceInternationl),
          icon: <Iconify icon="solar:wad-of-money-bold" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{
              typography: "body2",
              color: "text.secondary",
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              typography: "subtitle2",
              color: "text.primary",
              component: "span",
            }}
          />
        </Stack>
      ))}
    </Stack>
  );

  const renderCompany = (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={2}
      direction="row"
      sx={{ p: 3, borderRadius: 2, mt: 3 }}
    >
      <Avatar
        alt={name}
        src={coverUrl}
        variant="rounded"
        sx={{ width: 64, height: 64 }}
      />

      <Stack spacing={1}>
        <Typography variant="subtitle1">{name}</Typography>
        {/* <Typography variant="body2">{user.address}</Typography>
        <Typography variant="body2">{phoneNumber}</Typography> */}
      </Stack>
    </Stack>
  );
  // const renderColorOptions = (
  //   <Stack direction="row">
  //     <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //       Color
  //     </Typography>

  //     <Controller
  //       name="colors"
  //       control={control}
  //       render={({ field }) => (
  //         <ColorPicker
  //           colors={colors}
  //           selected={field.value}
  //           onSelectColor={(color) => field.onChange(color as string)}
  //           limit={4}
  //         />
  //       )}
  //     />
  //   </Stack>
  // );

  // const renderSizeOptions = (
  //   <Stack direction="row">
  //     <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //       Size
  //     </Typography>

  //     <RHFSelect
  //       name="size"
  //       size="small"
  //       helperText={
  //         <Link underline="always" color="textPrimary">
  //           Size Chart
  //         </Link>
  //       }
  //       sx={{
  //         maxWidth: 88,
  //         [`& .${formHelperTextClasses.root}`]: {
  //           mx: 0,
  //           mt: 1,
  //           textAlign: "right",
  //         },
  //       }}
  //     >
  //       {sizes.map((size) => (
  //         <MenuItem key={size} value={size}>
  //           {size}
  //         </MenuItem>
  //       ))}
  //     </RHFSelect>
  //   </Stack>
  // );

  //   const renderQuantity = (
  //     <Stack direction="row">
  //       <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
  //         Quantity
  //       </Typography>

  //       <Stack spacing={1}>
  //         <IncrementerButton
  //           name="quantity"
  //           quantity={values.quantity}
  //           disabledDecrease={values.quantity <= 1}
  //         //   disabledIncrease={values.quantity >= available}
  //           onIncrease={() => setValue("quantity", values.quantity + 1)}
  //           onDecrease={() => setValue("quantity", values.quantity - 1)}
  //         />

  //         <Typography
  //           variant="caption"
  //           component="div"
  //           sx={{ textAlign: "right" }}
  //         >
  //           Available: {available}
  //         </Typography>
  //       </Stack>
  //     </Stack>
  //   );

  const renderActions = (
    <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
      <Button
        fullWidth
        // disabled={isMaxQuantity || disabledActions}
        // disabled={disabledActions}
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: "nowrap" }}
      >
        Add to Cart
      </Button>

      {/* <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        disabled={disabledActions}
      >
        Buy Now
      </Button> */}
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      {description}
    </Typography>
  );

  // const renderRating = (
  //   <Stack
  //     direction="row"
  //     alignItems="center"
  //     sx={{
  //       color: "text.disabled",
  //       typography: "body2",
  //     }}
  //   >
  //     <Rating
  //       size="small"
  //       value={totalRatings}
  //       precision={0.1}
  //       readOnly
  //       sx={{ mr: 1 }}
  //     />
  //     {`(${fShortenNumber(totalReviews)} reviews)`}
  //   </Stack>
  // );

  // const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
  //   <Stack direction="row" alignItems="center" spacing={1}>
  //     {newLabel.enabled && <Label color="info">{newLabel.content}</Label>}
  //     {saleLabel.enabled && <Label color="error">{saleLabel.content}</Label>}
  //   </Stack>
  // );

  // const renderInventoryType = (
  //   <Box
  //     component="span"
  //     sx={{
  //       typography: "overline",
  //       color:
  //         (inventoryType === "out of stock" && "error.main") ||
  //         (inventoryType === "low stock" && "warning.main") ||
  //         "success.main",
  //     }}
  //   >
  //     {inventoryType}
  //   </Box>
  // );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        {renderContent}
      </Grid>

      <Grid xs={12} md={4}>
        {renderOverview}
        {renderCompany}
        {renderActions}
      </Grid>
    </Grid>

    // <FormProvider methods={methods} onSubmit={onSubmit}>
    //   <Stack spacing={3} sx={{ pt: 3 }} {...other}>
    //     <Stack spacing={2} alignItems="flex-start">
    //       {/* {renderLabels} */}

    //       {/* {renderInventoryType} */}

    //       <Typography variant="h5">{name}</Typography>

    //       {/* {renderRating} */}

    //       {renderPrice}

    //       {renderSubDescription}
    //     </Stack>

    //     <Divider sx={{ borderStyle: "dashed" }} />

    //     {/* {renderColorOptions} */}

    //     {/* {renderSizeOptions} */}

    //     {renderQuantity}

    //     <Divider sx={{ borderStyle: "dashed" }} />

    //     {renderShare}
    //   </Stack>
    // </FormProvider>
  );
}
