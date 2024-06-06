// @mui
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
// routes
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";
// utils
import { fDate } from "src/utils/format-time";
// components
import Iconify from "src/components/iconify";
import CustomPopover, { usePopover } from "src/components/custom-popover";
// types
import { IServiceItem } from "src/types/service";
import { useRouter } from "src/routes/hooks";
import { ICheckoutItem } from "src/types/checkout";
import { useCheckoutContext } from "../context";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

type Props = {
  service: IServiceItem;
  onAddCart?: (cartItem: ICheckoutItem) => void;
};

export default function ServiceItem({ service }: Props) {
  const {
    eid,
    id,
    name,
    available,
    price,
    volume,
    quantity,
    images,
    createdAt,
    user,
  } = service;

  const router = useRouter();
  const { onAddService } = useCheckoutContext();

  const popover = usePopover();

  const linkTo = paths.dashboard.shopservice.details(id);

  const handleAddCart = async () => {
    const newService = {
      eid,
      id,
      name,
      quantity: 1,
      available,
      price,
      volume,
      user,
    } as IServiceItem;
    try {
      onAddService(newService);

      // console.log("ADD TO CART: ", newService);
    } catch (error) {
      console.error(error);
    }
  };

  const onView = async () => {
    router.replace(linkTo);
  };

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
          {images?.[0] && (
            <Avatar
              alt={name}
              src={images[0]}
              variant="rounded"
              sx={{ width: 48, height: 48, mb: 2 }}
            />
          )}

          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link
                component={RouterLink}
                href={paths.dashboard.shopservice.details(id)}
                color="inherit"
              >
                {name}
              </Link>
            }
            secondary={`Created date: ${fDate(createdAt)}`}
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
        </Stack>

        <Stack direction="row" sx={{ p: 3, pb: 2 }}>
          <Typography variant="h4">₹</Typography>

          <Typography variant="h2">
            {(price / (service.volume != 0 ? volume : quantity)).toFixed(2)}
          </Typography>

          <Typography
            component="span"
            sx={{
              alignSelf: "center",
              color: "text.disabled",
              ml: 1,
              typography: "body2",
            }}
          >
            / {service.volume != 0 ? "KG" : "units"}
            {/* {service.volume != 0 ? `${volume} KG` : `${quantity} units`} */}
          </Typography>
        </Stack>
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
            handleAddCart();
          }}
        >
          <Iconify icon="solar:cart-plus-bold" />
          Add to Cart
        </MenuItem>
      </CustomPopover>
    </>
  );
}
