import * as Yup from "yup";
import { Form, useForm } from "react-hook-form";
import { useMemo, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
//routes
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
// components
import FormProvider from "src/components/hook-form";
import { useSnackbar } from "src/components/snackbar";
//types
import {
  ISupply,
  ISupplyChainItem,
  ISupplyChainSchema,
  ISupplyChainStepItem,
  ISupplyChainStepLabel,
  StepType,
} from "src/types/supplychain";

import { useCheckoutContext } from "./context";

import CheckoutBasic from "./checkout-basic";
import CheckoutSteps from "./checkout-steps";
import CheckoutSelectItems from "./checkout-select-items";
import CheckoutPreviewSteps from "./checkout-preview-steps";
import CheckoutConfigureSteps from "./checkout-configure-steps";
import { Button } from "@mui/base/Button";
import { useAuthContext } from "src/auth/hooks";
import {
  createSupplyChain,
  updateSupplyChain,
  // useGetToUser,
} from "src/api/supplychain";
// wagmi
// import { toUint256 } from "@wagmi/core";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "src/web3/wagmi.config";
import { getStorage } from "src/hooks/use-local-storage";
import { IServiceItem } from "src/types/service";
import { IRawMaterialItem } from "src/types/raw-materials";
import { simulateContract } from "@wagmi/core";
import { readContract } from "@wagmi/core";
// ABI
import {
  SupplySphereABI,
  addresses as supplysphereAddress,
} from "src/abi/supplysphere";
import {
  SupplyChainABI,
  addresses as supplyChainAddress,
} from "src/abi/supplychain";
// ----------------------------------------------------------------------

export const STEPS = [
  "Basic Info",
  "Select Items",
  "Configure Steps",
  "Preview",
];

// ----------------------------------------------------------------------

export const NewStepSchema = Yup.object<ISupplyChainStepItem>().shape({
  from: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).required("From is required"),
  to: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).required("To is required"),
  stepType: Yup.string()
    .oneOf(Object.values(StepType).map((type) => type.toString()))
    .required("Step Type is required"),
  transport: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).required("Transporter is required"),
  product: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).optional(),
  service: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).optional(),
  rawMaterial: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  }).optional(),
  eid: Yup.string().optional(),
  quantity: Yup.number().optional(),
  totalStepAmount: Yup.number().optional(),
});

export const NewSupplyChainSchema = Yup.object<ISupplyChainSchema>().shape({
  id: Yup.string().optional(),
  eid: Yup.string().optional(),
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  steps: Yup.array().of(NewStepSchema),
  // stepArray: Yup.array(
  //   Yup.object<ISupplyChainStepLabel>({
      // eid: Yup.string(),
      // from: Yup.string(),
      // to: Yup.string(),
      // stepType: Yup.string(),
      // transport: Yup.string(),
      // service: Yup.string().optional(),
      // rawMaterial: Yup.string().optional(),
      // product: Yup.string().optional(),
      // quantity: Yup.number(),
      // totalStepAmount: Yup.number(),
  //   })
  // ),
});

type Props = {
  currentSupplyChain?: ISupplyChainItem;
};

// ----------------------------------------------------------------------

export default function SupplyChainNewEditForm({ currentSupplyChain }: Props) {
  const router = useRouter();

  const { chainId } = useAccount();
  const checkout = useCheckoutContext();
  const { onReset } = useCheckoutContext();
  const { enqueueSnackbar } = useSnackbar();
  const { writeContractAsync } = useWriteContract();
  const [supplyChainID, setSupplyChainID] = useState<string>("");

  const defaultValues: ISupplyChainSchema = useMemo(
    () => ({
      id: currentSupplyChain?.id || "",
      eid: currentSupplyChain?.eid || "",
      name: currentSupplyChain?.name || "",
      description: currentSupplyChain?.description || "",
      steps: currentSupplyChain?.steps || [],
      // stepArray: currentSupplyChain?.stepArray || [],
    }),
    [currentSupplyChain]
  );

  // Main Form
  const methods = useForm({
    // resolver: yupResolver(NewSupplyChainSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (currentSupplyChain) {
      reset(defaultValues);
    }
  }, [currentSupplyChain, defaultValues, reset]);

  console.log("SupplychainId:", supplyChainID);

  const onSubmit = handleSubmit(async (data: any) => {
    console.log("clicked");
    console.log("DATA:", data);

    const backendSUpplychain = data?.steps?.map((item: ISupply) => {
      return {
        eid: item.eid,
        quantity: item.quantity,
        to: item.to.value,
        from: item.from.value,
        stepType: item.stepType,
        product: item?.product?.value,
        service: item?.service?.value,
        transport: item.transport.value,
        rawMaterial: item?.rawMaterial?.value,
      };
    });

    console.log(backendSUpplychain);

    try {
      const hash = await writeContractAsync({
        abi: SupplySphereABI,
        address: supplysphereAddress[`${chainId}`] as `0x${string}`,
        functionName: "fundChain",
        args: [BigInt(supplyChainID)],
      });

      const { transactionHash } = await waitForTransactionReceipt(config, {
        hash,
      });

      // Read Contract for supplychain object
      const stepResult = await readContract(config, {
        abi: SupplyChainABI,
        address: supplyChainAddress[`${chainId}`] as `0x${string}`,
        functionName: "getSupplyChain",
        args: [BigInt(supplyChainID)],
      });

      const stepsObject = stepResult?.steps;

      // ----------------------------------------------------------------------

      for (let i = 0; i < backendSUpplychain.length; i++) {
        backendSUpplychain[i].eid = String(stepsObject[i].stepId);
      }

      data.steps = backendSUpplychain;

      data.eid = String(supplyChainID);
      data.transactionHash = String(transactionHash);
      console.log("Final DATA:", data);

      await createSupplyChain(data);
      enqueueSnackbar("Fund chain success!", { variant: "success" });

      onReset();
      router.push(paths.dashboard.supplychain.root);
    } catch (error) {
      enqueueSnackbar("Fund chain un-success!", { variant: "error" });
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <CheckoutSteps activeStep={checkout.activeStep} steps={STEPS} />
      {checkout.activeStep === 0 && <CheckoutBasic />}
      {checkout.activeStep === 1 && <CheckoutSelectItems />}
      {checkout.activeStep === 2 && <CheckoutConfigureSteps />}
      {checkout.activeStep === 3 && (
        <CheckoutPreviewSteps
          // handleFormSubmit={onSubmit}
          handleSupplychainId={setSupplyChainID}
        />
      )}
    </FormProvider>
  );
}
