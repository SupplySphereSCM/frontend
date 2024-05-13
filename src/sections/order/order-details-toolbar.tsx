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

// ----------------------------------------------------------------------

type Props = {
  status: string;
  // stepType: string;
  backLink: string;
  orderNumber: string;
  createdAt: Date;
  onChangeStatus: (newValue: string) => void;
  statusOptions: {
    value: string;
    label: string;
  }[];
};

export default function OrderDetailsToolbar({
  status,
  // stepType,
  backLink,
  createdAt,
  orderNumber,
  statusOptions,
  onChangeStatus,
}: Props) {
  const popover = usePopover();

  const handleOrderSender = () => {
    console.log("Order sent");
    // updateOrder({
    //   ...order,
    //   orderStatus = "TRANSIT",
    // });
    // Update the Order STATUS
  };
  const handleOrderReceiver = () => {
    console.log("Order Received");
    // Update the Order STATUS
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
                Order #{orderNumber.slice(0, 5)}
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
              {fDateTime(createdAt)}
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
          {/* {stepType === "SERVICING" && ( */}
          <Button
            onClick={handleOrderReceiver}
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="eva:diagonal-arrow-left-down-fill" />}
          >
            Confirm Receiver
          </Button>
          {/* )} */}
          <Button
            onClick={handleOrderSender}
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="eva:diagonal-arrow-right-up-fill" />}
          >
            Confirm Sender
          </Button>

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
