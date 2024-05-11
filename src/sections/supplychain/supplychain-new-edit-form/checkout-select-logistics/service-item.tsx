// @mui
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
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
import { IServiceItem, ITransporterServiceItem } from "src/types/service";
import { useRouter } from "src/routes/hooks";
import { useCallback } from "react";
import { useCheckoutContext } from "../context";
import { useLocalStorage, getStorage } from "src/hooks/use-local-storage";

// ----------------------------------------------------------------------
const STORAGE_KEY = "checkout";
type Props = {
  service: ITransporterServiceItem;

  // onView: VoidFunction;
  // onEdit: VoidFunction;
  // onDelete: VoidFunction;
};

export default function ServiceItem({ service }: Props) {
  const {
    id,
    name,
    coverUrl,
    priceInterState,
    priceWithinState,
    priceInternationl,
    createdAt,
  } = service;

  const router = useRouter();
  const { onAddLogistics } = useCheckoutContext();

  const popover = usePopover();
  const value = getStorage(STORAGE_KEY);

  const linkTo = paths.dashboard.transporter.details(id as string);
  // console.log(value);

  const handleAddCart = async () => {
    const newLogistics = {
      id,
      name,
      // quantity: 1,
      priceWithinState,
    };
    try {
      onAddLogistics(newLogistics);
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
          {/* {coverUrl[0] && ( */}
          <Avatar
            alt={name}
            src={coverUrl}
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2 }}
          />
          {/* )} */}

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
              / 100 kms
            </Typography>
          </Stack>
          {/* <Stack direction="row">
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
          </Stack> */}
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
          <Iconify icon="solar:pen-bold" />
          Add to Card
        </MenuItem>
      </CustomPopover>
    </>
  );
}
