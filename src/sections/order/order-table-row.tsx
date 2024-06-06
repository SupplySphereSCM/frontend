import { format } from "date-fns";
// @mui
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Collapse from "@mui/material/Collapse";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// utils
import { fCurrency } from "src/utils/format-number";
// types
import { IOrderItem } from "src/types/order";
// components
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import { useAuthContext } from "src/auth/hooks";

// ----------------------------------------------------------------------

type Props = {
  row: IOrderItem;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function OrderTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { items, orderStatus, id, from, createdAt, to, quantity, total } = row;
  console.log(row);

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();
  const { user } = useAuthContext();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          #{id.slice(0, 5)}
        </Box>
      </TableCell>

      <TableCell sx={{ display: "flex", alignItems: "center" }}>
        {user?.roles[0] === "MANUFACTURER" ? (
          <>
            <Avatar
              alt={from?.firstName}
              src={from?.profilePictureUrl}
              sx={{ mr: 2 }}
            />
            <ListItemText
              primary={from?.firstName}
              secondary={from?.email}
              primaryTypographyProps={{ typography: "body2" }}
              secondaryTypographyProps={{
                component: "span",
                color: "text.disabled",
              }}
            />
          </>
        ) : (
          <>
            {" "}
            <Avatar
              alt={to?.firstName}
              src={to?.profilePictureUrl}
              sx={{ mr: 2 }}
            />
            <ListItemText
              primary={to?.firstName}
              secondary={to?.email}
              primaryTypographyProps={{ typography: "body2" }}
              secondaryTypographyProps={{
                component: "span",
                color: "text.disabled",
              }}
            />
          </>
        )}
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(createdAt), "dd MMM yyyy")}
          secondary={format(new Date(createdAt), "p")}
          primaryTypographyProps={{ typography: "body2", noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: "span",
            typography: "caption",
          }}
        />
      </TableCell>

      <TableCell align="center"> {quantity} </TableCell>

      <TableCell> ₹ {total} </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (orderStatus === "completed" && "success") ||
            (orderStatus === "pending" && "warning") ||
            (orderStatus === "cancelled" && "error") ||
            "default"
          }
        >
          {orderStatus}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: "nowrap" }}>
        {/* <IconButton
          color={collapse.value ? "inherit" : "default"}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: "action.hover",
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton> */}

        <IconButton
          color={popover.open ? "inherit" : "default"}
          onClick={popover.onOpen}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: "none" }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: "background.neutral" }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {/* {items.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  "&:not(:last-of-type)": {
                    borderBottom: (theme) =>
                      `solid 2px ${theme.palette.background.neutral}`,
                  },
                }}
              >
                <Avatar
                  src={item.coverUrl}
                  variant="rounded"
                  sx={{ width: 48, height: 48, mr: 2 }}
                />

                <ListItemText
                  primary={item.name}
                  secondary={item.sku}
                  primaryTypographyProps={{
                    typography: "body2",
                  }}
                  secondaryTypographyProps={{
                    component: "span",
                    color: "text.disabled",
                    mt: 0.5,
                  }}
                />

                <Box>x{item.quantity}</Box>

                <Box sx={{ width: 110, textAlign: "right" }}>
                  {fCurrency(item.price)}
                </Box>
              </Stack>
            ))} */}
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
