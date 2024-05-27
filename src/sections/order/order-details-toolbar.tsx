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
import { useSnackbar } from "src/components/snackbar";
import { updateOrder } from "src/api/orders";
import { useAuthContext } from "src/auth/hooks";
import { IOrderItem } from "src/types/order";
// @wagmi
import { config } from "src/web3/wagmi.config";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { SupplySphereABI, addresses, ROLES } from "src/abi/supplysphere";

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
  const { enqueueSnackbar } = useSnackbar();

  const { address, chainId } = useAccount();

  const { writeContractAsync } = useWriteContract();
  console.log("order-details-toolbar:", order.stepEid);

  const handleOrderSender = async () => {
    console.log("Order sent");
    try {
      const hash = await writeContractAsync({
        abi: SupplySphereABI,
        address: addresses[`${chainId}`],
        functionName: "confirmSender",
        args: [BigInt(order?.supplyChainEId!), BigInt(order?.stepEid!)],
      });
      const { transactionHash } = await waitForTransactionReceipt(config, {
        hash,
      });
      order.transactionHash = transactionHash;
      await updateOrder(order, "PROCESSING");
      console.log("Order Sent");
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };
  const handleOrderReceiver = async () => {
    console.log("Order Received");
    try {
      const hash = await writeContractAsync({
        abi: SupplySphereABI,
        address: addresses[`${chainId}`],
        functionName: "confirmReceiver",
        args: [BigInt(order?.supplyChainEId!), BigInt(order?.stepEid!)],
      });
      const { transactionHash } = await waitForTransactionReceipt(config, {
        hash,
      });
      order.transactionHash = transactionHash;
      await updateOrder(order, "DELIVERED");
      console.log("Order Received");
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleTransporterOrderSender = async () => {
    console.log("Order Off loaded");
    try {
      const hash = await writeContractAsync({
        abi: SupplySphereABI,
        address: addresses[`${chainId}`],
        functionName: "confirmTransporterDelivered",
        args: [BigInt(order?.supplyChainEId!), BigInt(order?.stepEid!)],
      });
      const { transactionHash } = await waitForTransactionReceipt(config, {
        hash,
      });
      order.transactionHash = transactionHash;
      await updateOrder(order, "OFFLOADED"); // Pass the order object and orderStatus directly
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleTransporterOrderReceiver = async () => {
    console.log("Order on loaded");
    try {
      const hash = await writeContractAsync({
        abi: SupplySphereABI,
        address: addresses[`${chainId}`],
        functionName: "confirmTransporterReceived",
        args: [BigInt(order?.supplyChainEId!), BigInt(order?.stepEid!)],
      });
      const { transactionHash } = await waitForTransactionReceipt(config, {
        hash,
      });
      order.transactionHash = transactionHash;
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
          {/* <Button
            color="inherit"
            variant="outlined"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={popover.onOpen}
            sx={{ textTransform: "capitalize" }}
          >
            {status}
          </Button> */}

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
            <>
              {((order?.stepType && order?.stepType === "SERVICING") ||
                user?.roles[0] === "SELLER") && (
                <Button
                  onClick={handleOrderReceiver}
                  color="inherit"
                  variant="outlined"
                  startIcon={
                    <Iconify icon="eva:diagonal-arrow-left-down-fill" />
                  }
                >
                  Confirm Receiver
                </Button>
              )}
              {user?.roles[0] !== "MANUFACTURER" && (
                <Button
                  onClick={handleOrderSender}
                  color="inherit"
                  variant="outlined"
                  startIcon={
                    <Iconify icon="eva:diagonal-arrow-right-up-fill" />
                  }
                >
                  Confirm Sender
                </Button>
              )}
            </>
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
