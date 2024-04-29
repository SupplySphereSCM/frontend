// @mui
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
// types
import { ISupplyChainItem } from "src/types/supplychain";
// utils
import { fDate } from "src/utils/format-time";
// routes
import { paths } from "src/routes/paths";
// components
import Iconify from "src/components/iconify";
import { RouterLink } from "src/routes/components";
import CustomPopover, { usePopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

type Props = {
  supplyChain: ISupplyChainItem;
  onView: VoidFunction;
  onEdit: VoidFunction;
  onDelete: VoidFunction;
};

export default function SupplyChainItem({
  supplyChain,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const popover = usePopover();

  const { id, name, image, createdAt } = supplyChain;

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
          {image && (
            <Avatar
              alt={name}
              src={image}
              variant="rounded"
              sx={{ width: 48, height: 48, mb: 2 }}
            />
          )}

          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link
                component={RouterLink}
                href={paths.dashboard.supplychain.details(id)}
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
  );
}
