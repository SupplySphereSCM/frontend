// @mui
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
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

// ----------------------------------------------------------------------

type Props = {
  service: IServiceItem;
};

export default function ServiceItem({ service }: Props) {
  const { id, name, available, images, createdAt } = service;

  const router = useRouter();

  const popover = usePopover();

  const linkTo = paths.service.details(id);

  const handleAddCart = async () => {
    const newService = {
      id,
      name,
      quantity: 1,
    };
    try {
      console.log("ADD TO CART: ", newService);
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
        <Stack sx={{ p: 3, pb: 2 }}>
          {images[0] && (
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
                href={paths.dashboard.service.details(id)}
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
