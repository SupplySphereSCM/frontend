import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useMemo, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
//routes
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
// components
import FormProvider from "src/components/hook-form";
import { useSnackbar } from "src/components/snackbar";
//types
import {
  ISupplyChainItem,
  ISupplyChainSchema,
  ISupplyChainStepItem,
} from "src/types/supplychain";

import { useCheckoutContext } from "./context";

import CheckoutBasic from "./checkout-basic";
import CheckoutSteps from "./checkout-steps";
import CheckoutSelectItems from "./checkout-select-items";
import CheckoutPreviewSteps from "./checkout-preview-steps";
import CheckoutConfigureSteps from "./checkout-configure-steps";
import { Button } from "@mui/base/Button";
import { useAuthContext } from "src/auth/hooks";
import { createSupplyChain, updateSupplyChain } from "src/api/supplychain";
// wagmi
// import { toUint256 } from "@wagmi/core";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "src/web3/wagmi.config";
import supplychain from "src/abi/SupplyChain.json";
import supplychainABI from "src/abi/supplychain.abi";

// ----------------------------------------------------------------------

export const STEPS = [
  "Basic Info",
  "Select Items",
  "Configure Steps",
  "Preview",
];

enum StepType {
  Procurement = "PROCURING",
  Servicing = "SERVICING",
}
// ----------------------------------------------------------------------

export const NewStepSchema = Yup.object().shape({
  from: Yup.object()
    .shape({ label: Yup.string(), value: Yup.string() })
    .required("From is required"),
  to: Yup.object()
    .shape({ label: Yup.string(), value: Yup.string() })
    .required("To is required"),
  stepType: Yup.string()
    .oneOf(Object.values(StepType).map((role) => role.toString()))
    .required("Step Type is required"),
  transport: Yup.object()
    .shape({ label: Yup.string(), value: Yup.string() })
    .required("Transporter is required"),
  product: Yup.object().shape({ label: Yup.string(), value: Yup.string() }),
  service: Yup.object().shape({ label: Yup.string(), value: Yup.string() }),
  rawMaterial: Yup.object().shape({ label: Yup.string(), value: Yup.string() }),
});
// export const NewStepSchema = Yup.object.shape({
//   from: Yup.string().required("From is required"),
//   to: Yup.string().required("To is required"),
//   product: Yup.string(),
//   service: Yup.string(),
//   rawMaterial: Yup.string(),
//   stepType: Yup.string()
//     .oneOf(Object.values(StepType).map((role) => role.toString()))
//     .required("Step Type is required"),
//   transport: Yup.string().required("Transporter is required"),
// });

export const NewSupplyChainSchema = Yup.object<ISupplyChainSchema>().shape({
  id: Yup.string(),
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  steps: Yup.array().of(NewStepSchema),
});

type Props = {
  currentProduct?: ISupplyChainItem;
};

// ----------------------------------------------------------------------

export default function SupplyChainNewEditForm({ currentProduct }: Props) {
  const router = useRouter();

  const checkout = useCheckoutContext();
  const { onReset } = useCheckoutContext();
  const { enqueueSnackbar } = useSnackbar();
  const { writeContractAsync } = useWriteContract();

  const defaultValues: ISupplyChainSchema = useMemo(
    () => ({
      id: currentProduct?.id,
      // eid: currentProduct?.eid,
      name: currentProduct?.name || "",
      description: currentProduct?.description || "",
      steps: currentProduct?.steps || [],
      transactionHash: currentProduct?.transactionHash || "",
      // const defaultSteps: ISupplyChainStepItem[] = currentProduct?.steps || [];

      // return {
      //   ...currentProduct,
      // steps: defaultSteps,
      // from: { label: "", value: "" },
      // to: { label: "", value: "" },
      // transport: { label: "", value: "" },
      // service: { label: "", value: "" },
      // rawMaterial: { label: "", value: "" },
      // stepType: "",
      // }
    }),
    [currentProduct],
  );

  const methods = useForm({
    // This was the problem for submit not working
    // resolver: yupResolver(NewSupplyChainSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log("Data", data);
      if (data?.id) {
        await updateSupplyChain(data);
      } else {
        // const hash = await writeContractAsync({
        //   abi: supplychainABI,
        //   address: supplychain.address as `0x${string}`,
        //   functionName: "createSupplyChain",
        //   // @ts-ignore
        //   args: [data.name, data.description, data.steps],
        // });
        // const { transactionHash } = await waitForTransactionReceipt(config, {
        //   hash,
        // });
        // // Include hash and transactionHash in the data object
        // data.eid = hash;
        // data.transactionHash = transactionHash;
        await createSupplyChain(data);
      }
      enqueueSnackbar(currentProduct ? "Update success!" : "Create success!");
      onReset();
      router.push(paths.dashboard.supplychain.root);
    } catch (error) {
      console.error(error);
    }
  });

  // const onSubmit = handleSubmit(
  //   async (data) => {
  //     try {
  //       console.log("DATA: ", data);
  //       // createSupplyChain(data);
  //       // reset();
  //       enqueueSnackbar(currentProduct ? "Update success!" : "Create success!");
  //       router.push(paths.dashboard.product.root);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   },
  //   () => {
  //     console.log("something");
  //   }
  // );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <CheckoutSteps activeStep={checkout.activeStep} steps={STEPS} />
      {checkout.activeStep === 0 && <CheckoutBasic />}
      {checkout.activeStep === 1 && <CheckoutSelectItems />}
      {checkout.activeStep === 2 && <CheckoutConfigureSteps />}
      {checkout.activeStep === 3 && <CheckoutPreviewSteps />}
      {/* <Button type="submit">Submit</Button> */}
    </FormProvider>
  );
}
