// @mui
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
// routes
import { RouterLink } from "src/routes/components";
// utils
import { fDateTime } from "src/utils/format-time";
// components
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import { updateOrder } from "src/api/orders";
import { useAuthContext } from "src/auth/hooks";
import { IOrderItem } from "src/types/order";

// ----------------------------------------------------------------------

type Props = {
  order: Partial<IOrderItem>; // Add order prop here
  status: string;
  backLink: string;
  onChangeStatus: (newValue: string) => void;
  statusOptions: {
    value: string;
    label: string;
  }[];
};

export default function OrderDetailsToolbar({
  order,
  status,
  backLink,
  statusOptions,
  onChangeStatus,
}: Props) {
  const popover = usePopover();
  const { user } = useAuthContext();

  const handleOrderSender = async () => {
    console.log("Order sent");
    try {
      await updateOrder(order, "PROCESSING");
      console.log("Order Sent");
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };
  // const handleOrderReceiver = async () => {
  //   console.log("Order Received");
  //   try {
  //     await updateOrder(order, "DELIVERED");
  //     console.log("Order Received");
  //   } catch (error) {
  //     console.error("Failed to update order status:", error);
  //   }
  // };

  const handleTransporterOrderSender = async () => {
    console.log("Order Off loaded");
    try {
      await updateOrder(order, "DELIVERED"); // Pass the order object and orderStatus directly
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleTransporterOrderReceiver = async () => {
    console.log("Order on loaded");
    try {
      await updateOrder(order, "TRANSIT");
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: "column", md: "row" }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4">
                {" "}
                Order #{order?.id?.slice(0, 5)}
              </Typography>
              <Label
                variant="soft"
                color={
                  (status === "completed" && "success") ||
                  (status === "pending" && "warning") ||
                  (status === "cancelled" && "error") ||
                  "default"
                }
              >
                {status}
              </Label>
            </Stack>

            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              {fDateTime(order?.createdAt)}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          flexGrow={1}
          spacing={1.5}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Button
            color="inherit"
            variant="outlined"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={popover.onOpen}
            sx={{ textTransform: "capitalize" }}
          >
            {status}
          </Button>

          {user?.roles[0] === "TRANSPORTER" ? (
            <>
              <Button
                onClick={handleTransporterOrderReceiver}
                color="inherit"
                variant="outlined"
                startIcon={<Iconify icon="eva:diagonal-arrow-right-up-fill" />}
              >
                OnLoad
              </Button>
              <Button
                onClick={handleTransporterOrderSender}
                color="inherit"
                variant="outlined"
                startIcon={<Iconify icon="eva:diagonal-arrow-right-up-fill" />}
              >
                OffLoad
              </Button>
            </>
          ) : (
            // <>
            // {order?.stepType && order?.stepType === "SERVICING" && (
            //   <Button
            //     onClick={handleOrderReceiver}
            //     color="inherit"
            //     variant="outlined"
            //     startIcon={
            //       <Iconify icon="eva:diagonal-arrow-left-down-fill" />
            //     }
            //   >
            //     Confirm Receiver
            //   </Button>
            // )}
            <Button
              onClick={handleOrderSender}
              color="inherit"
              variant="outlined"
              startIcon={<Iconify icon="eva:diagonal-arrow-right-up-fill" />}
            >
              Confirm Sender
            </Button>
          )}

          {/* <Button
            color="inherit"
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
          >
            Edit
          </Button> */}
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === status}
            onClick={() => {
              popover.onClose();
              onChangeStatus(option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
