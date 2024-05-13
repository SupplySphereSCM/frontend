import { format } from "date-fns";
// @mui
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// utils
import { fCurrency } from "src/utils/format-number";
// types
import { IInvoice } from "src/types/invoice";
// components
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

type Props = {
  row: IInvoice;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function InvoiceTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}: Props) {
  const {
    sent,
    id,
    particular,
    createdAt,
    // dueDate,
    order,
    to,
    total,
  } = row;
  console.log("invoice-table-row", row);

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: "flex", alignItems: "center" }}>
          <Avatar alt={to?.firstName} sx={{ mr: 2 }}>
            {to?.firstName.charAt(0).toUpperCase()}
          </Avatar>

          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {to?.firstName}
              </Typography>
            }
            secondary={
              <Link
                noWrap
                variant="body2"
                onClick={onViewRow}
                sx={{ color: "text.disabled", cursor: "pointer" }}
              >
                INV-{id.slice(0, 5)}
              </Link>
            }
          />
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

        {/* <TableCell>
          <ListItemText
            primary={format(new Date(dueDate), "dd MMM yyyy")}
            secondary={format(new Date(dueDate), "p")}
            primaryTypographyProps={{ typography: "body2", noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: "span",
              typography: "caption",
            }}
          />
        </TableCell> */}

        <TableCell>{fCurrency(total)}</TableCell>

        {/* <TableCell align="center">{sent}</TableCell> */}

        <TableCell>
          {particular}
          {/* <Label
            variant="soft"
            color={
              (order.orderStatus === "paid" && "success") ||
              (order.orderStatus === "pending" && "warning") ||
              (order.orderStatus === "overdue" && "error") ||
              "default"
            }
          >
            {order.orderStatus}
          </Label> */}
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton
            color={popover.open ? "inherit" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: "dashed" }} />

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
