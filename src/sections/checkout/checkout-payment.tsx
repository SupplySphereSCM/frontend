import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";
// types
import {
  ICheckoutCardOption,
  ICheckoutPaymentOption,
  ICheckoutDeliveryOption,
} from "src/types/checkout";
// components
import Iconify from "src/components/iconify";
import FormProvider from "src/components/hook-form";
import { useSnackbar } from "src/components/snackbar";
//
import { useCheckoutContext } from "./context";
import CheckoutSummary from "./checkout-summary";
import CheckoutDelivery from "./checkout-delivery";
import CheckoutBillingInfo from "./checkout-billing-info";
import CheckoutPaymentMethods from "./checkout-payment-methods";
import { useGetShopTransporterServices } from "src/api/service";
// @wagmi
import { parseUnits } from "viem";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { waitForTransactionReceipt } from "@wagmi/core";
import { Context, useAccount, useWriteContract } from "wagmi";
import { updateUser, verifyEthUserAddr } from "src/api/users";
import { config } from "src/web3/wagmi.config";
import { INRABI, addresses as inrAddresses } from "src/abi/inr";
import { IUser } from "src/types/user";
import { AuthContext } from "src/auth/context/jwt";
import { useAuthContext } from "src/auth/hooks";
import { useState } from "react";
import { createOrder } from "src/api/orders";
// ----------------------------------------------------------------------

const DELIVERY_OPTIONS: ICheckoutDeliveryOption[] = [
  {
    value: 0,
    label: "Free",
    description: "5-7 Days delivery",
  },
  {
    value: 10,
    label: "Standard",
    description: "3-5 Days delivery",
  },
  {
    value: 20,
    label: "Express",
    description: "2-3 Days delivery",
  },
];

const PAYMENT_OPTIONS: ICheckoutPaymentOption[] = [
  {
    value: "paypal",
    label: "Pay with Paypal",
    description:
      "You will be redirected to PayPal website to complete your purchase securely.",
  },
  {
    value: "credit",
    label: "Credit / Debit Card",
    description: "We support Mastercard, Visa, Discover and Stripe.",
  },
  {
    value: "cash",
    label: "Cash",
    description: "Pay with cash when your order is delivered.",
  },
];

// const CARDS_OPTIONS: ICheckoutCardOption[] = [
//   { value: "ViSa1", label: "**** **** **** 1212 - Jimmy Holland" },
//   { value: "ViSa2", label: "**** **** **** 2424 - Shawn Stokes" },
//   { value: "MasterCard", label: "**** **** **** 4545 - Cole Armstrong" },
// ];

export default function CheckoutPayment() {
  const checkout = useCheckoutContext();
  const { writeContractAsync } = useWriteContract();
  const { chainId } = useAccount();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedTransportId, setSelectedTransportId] = useState<string>("");
  console.log("Checkout values: ", checkout);
  console.log("logistics id:", selectedTransportId);

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required("Payment is required"),
  });

  const { services, servicesLoading, servicesError } =
    useGetShopTransporterServices();
  console.log("logistics:", services);

  const defaultValues = {
    delivery: checkout.shipping,
    payment: "",
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handlePayment = async () => {
    try {
      // const sender = user?.ethAddress;
      // console.log("sender:", sender);
      // console.log("recipient :", recipient);
      // console.log("total :", checkout.total);

      const recipient = checkout.items[0]?.user?.ethAddress;
      console.log(recipient);

      const hash = await writeContractAsync({
        abi: INRABI,
        address: inrAddresses[`${chainId}`] as `0x${string}`,
        functionName: "transfer",
        args: [
          // String(sender) as `0x${string}`,
          recipient as `0x${string}`,
          parseUnits(String(checkout.total), 2),
        ],
      });
      const { transactionHash } = await waitForTransactionReceipt(config, {
        hash,
      });

      const logisticsUserId = services?.find((item) => {
        item.id === selectedTransportId;
      });
      console.log("logisticsUserId:", logisticsUserId);

      const backendData = {
        from: checkout.items[0]?.user?.id,
        to: user?.id,
        via: logisticsUserId?.user?.id,
        product: checkout?.items[0]?.id,
        transport: selectedTransportId,
        tax: checkout?.items[0]?.tax | 0,
        total: checkout?.total,
        deliveryCharges: checkout?.shipping,
        quantity: checkout?.items[0]?.quantity,
      };
      console.log("Backend data:", backendData);

      await createOrder(backendData);
      // console.log("transactionHash:", transactionHash);
      enqueueSnackbar("Purchase successfully!", {
        variant: "success",
      });
      checkout.onNextStep();
      checkout.onReset();
      // console.info("DATA", data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Purchase un-successfully!", {
        variant: "error",
      });
    }
  };

  return (
    <>
      <FormProvider methods={methods}>
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <CheckoutDelivery
              setSelectedTransportId={setSelectedTransportId}
              onApplyShipping={checkout.onApplyShipping}
              options={services}
            />

            {/* <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            options={PAYMENT_OPTIONS}
            sx={{ my: 3 }}
          /> */}

            <Button
              size="small"
              color="inherit"
              onClick={checkout.onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              Back
            </Button>
          </Grid>

          <Grid xs={12} md={4}>
            <CheckoutBillingInfo
              billing={checkout.billing}
              onBackStep={checkout.onBackStep}
            />

            <CheckoutSummary
              total={checkout.total}
              subTotal={checkout.subTotal}
              discount={checkout.discount}
              shipping={checkout.shipping}
              onEdit={() => checkout.onGotoStep(0)}
            />

            <LoadingButton
              fullWidth
              size="large"
              // type="submit"
              onClick={handlePayment}
              variant="contained"
              // loading={isSubmitting}
            >
              Complete Order
            </LoadingButton>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
