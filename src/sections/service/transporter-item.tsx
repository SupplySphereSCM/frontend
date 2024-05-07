// @mui
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
// routes
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";
// utils
import { fDate } from "src/utils/format-time";
import { fCurrency } from "src/utils/format-number";
// components
import Label from "src/components/label";
import Image from "src/components/image";
import Iconify from "src/components/iconify";
import CustomPopover, { usePopover } from "src/components/custom-popover";

import { ColorPreview } from "src/components/color-utils";
// types
import { ITransporterServiceItem } from "src/types/service";
//
import { useCheckoutContext } from "../checkout/context";

// ----------------------------------------------------------------------

type Props = {
  service: ITransporterServiceItem;
  onView: VoidFunction;
  onEdit: VoidFunction;
  onDelete: VoidFunction;
};

export default function TransporterItem({
  service,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const popover = usePopover();
  const { onAddToCart } = useCheckoutContext();
  console.log("Service item:", service);

  const {
    id,
    name,
    coverUrl,
    priceWithinState,
    priceInterState,
    priceInternationl,
    description,
    createdAt,
    updatedAt,
    // sizes,
    // priceSale,
    // newLabel,
    // saleLabel,
  } = service;

  //   console.log(service);
  // console.log("type", type);
  // console.log("volume", volume);
  // console.log(quantity);

  //   const linkTo = paths.transporter.details(id);

  //   const handleAddCart = async () => {
  //     const newService = {
  //       id,
  //       name,
  //       priceWithinState,
  //       priceInterState,
  //       priceInternationl,
  //       description,
  //       createdAt,
  //       updatedAt,
  //       // colors: [colors[0]],
  //       // size: sizes[0],
  //     };
  //     try {
  //       onAddToCart(newService);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  // const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
  //   <Stack
  //     direction="row"
  //     alignItems="center"
  //     spacing={1}
  //     sx={{ position: "absolute", zIndex: 9, top: 16, right: 16 }}
  //   >
  //     {newLabel.enabled && (
  //       <Label variant="filled" color="info">
  //         {newLabel.content}
  //       </Label>
  //     )}
  //     {saleLabel.enabled && (
  //       <Label variant="filled" color="error">
  //         {saleLabel.content}
  //       </Label>
  //     )}
  //   </Stack>
  // );

  //   const renderImg = (
  //     <Box sx={{ position: "relative", p: 1 }}>
  //       {!!available && (
  //         <Fab
  //           color="warning"
  //           size="medium"
  //           className="add-cart-btn"
  //           onClick={handleAddCart}
  //           sx={{
  //             right: 16,
  //             bottom: 16,
  //             zIndex: 9,
  //             opacity: 0,
  //             position: "absolute",
  //             transition: (theme) =>
  //               theme.transitions.create("all", {
  //                 easing: theme.transitions.easing.easeInOut,
  //                 duration: theme.transitions.duration.shorter,
  //               }),
  //           }}
  //         >
  //           <Iconify icon="solar:cart-plus-bold" width={24} />
  //         </Fab>
  //       )}

  //       <Tooltip title={!available && "Out of stock"} placement="bottom-end">
  //         <Image
  //           alt={name}
  //           src={coverUrl || "/assets/icons/files/ic_file.svg"}
  //           ratio="1/1"
  //           sx={{
  //             borderRadius: 1.5,
  //             ...(!available && {
  //               opacity: 0.48,
  //               filter: "grayscale(1)",
  //             }),
  //           }}
  //         />
  //       </Tooltip>
  //     </Box>
  //   );

  //   const renderContent = (
  //     <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
  //       <Link
  //         component={RouterLink}
  //         href={linkTo}
  //         color="inherit"
  //         variant="subtitle2"
  //         noWrap
  //       >
  //         {name}
  //       </Link>

  //       <Stack direction="row" alignItems="center" justifyContent="space-between">
  //         {/* <ColorPreview colors={colors} /> */}

  //         {/* <Stack direction="row" spacing={0.5} sx={{ typography: "subtitle1" }}>
  //           {priceSale && (
  //             <Box
  //               component="span"
  //               sx={{ color: "text.disabled", textDecoration: "line-through" }}
  //             >
  //               {fCurrency(priceSale)}
  //             </Box>
  //           )}

  //           <Box component="span">{fCurrency(price)}</Box>
  //         </Stack> */}
  //       </Stack>
  //     </Stack>
  //   );

  return (
    <>
      <Card>
        <IconButton
          onClick={popover.onOpen}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

        <Stack sx={{ p: 3, pb: 2 }}>
          <Avatar
            alt={service.name}
            src={service.coverUrl}
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2 }}
          />

          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link
                component={RouterLink}
                href={paths.dashboard.transporter.details(id as string)}
                color="inherit"
              >
                {name}
              </Link>
            }
            secondary={`Posted date: ${fDate(createdAt)}`}
            primaryTypographyProps={{
              typography: "subtitle1",
            }}
            secondaryTypographyProps={{
              mt: 1,
              component: "span",
              typography: "caption",
              color: "text.disabled",
            }}
          />

          <Stack direction="row">
            <Typography variant="h4">$</Typography>

            <Typography variant="h2">{priceWithinState}</Typography>

            <Typography
              component="span"
              sx={{
                alignSelf: "center",
                color: "text.disabled",
                ml: 1,
                typography: "body2",
              }}
            >
              for With in state
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography variant="h4">$</Typography>

            <Typography variant="h2">{priceInterState}</Typography>

            <Typography
              component="span"
              sx={{
                alignSelf: "center",
                color: "text.disabled",
                ml: 1,
                typography: "body2",
              }}
            >
              for Inter state
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography variant="h4">$</Typography>

            <Typography variant="h2">{priceInternationl}</Typography>

            <Typography
              component="span"
              sx={{
                alignSelf: "center",
                color: "text.disabled",
                ml: 1,
                typography: "body2",
              }}
            >
              for International
            </Typography>
          </Stack>
        </Stack>

        {/* <Divider sx={{ borderStyle: "dashed" }} /> */}

        {/* <Box
          rowGap={1.5}
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          sx={{ p: 3 }}
        >
          {[
            // {
            //   label: description,
            //   icon: (
            //     <Iconify
            //       width={16}
            //       icon="carbon:skill-level-basic"
            //       sx={{ flexShrink: 0 }}
            //     />
            //   ),
            // },
            {
              label: service.volume != 0 ? `${volume} KG` : `${quantity} units`,
              icon: (
                <Iconify
                  width={16}
                  icon="solar:clock-circle-bold"
                  sx={{ flexShrink: 0 }}
                />
              ),
            },
            // {
            //   label: fCurrency(service.price),
            //   icon: (
            //     <Iconify
            //       width={16}
            //       icon="solar:wad-of-money-bold"
            //       sx={{ flexShrink: 0 }}
            //     />
            //   ),
            // },
          ].map((item) => (
            <Stack
              key={item.label}
              spacing={0.5}
              flexShrink={0}
              direction="row"
              alignItems="center"
              sx={{ color: "text.disabled", minWidth: 0 }}
            >
              {item.icon}
              <Typography variant="caption" noWrap>
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Box> */}
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEdit();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>

    // <Card
    //   sx={{
    //     "&:hover .add-cart-btn": {
    //       opacity: 1,
    //     },
    //   }}
    // >
    //   {/* {renderLabels} */}

    //   {renderImg}

    //   {renderContent}
    // </Card>
  );
}
