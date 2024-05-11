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

// ----------------------------------------------------------------------

export const STEPS = [
  "Basic Info",
  "Select Items",
  "Configure Steps",
  "Preview",
];

enum StepType {
  Procurement = "Procuring",
  Servicing = "Servicing",
}
// ----------------------------------------------------------------------

export const NewStepSchema = Yup.object<ISupplyChainStepItem>({
  from: Yup.string().required("From is required"),
  to: Yup.string().required("To is required"),
  product: Yup.string(),
  service: Yup.string(),
  rawMaterial: Yup.string(),
  stepType: Yup.string()
    .oneOf(Object.values(StepType).map((role) => role.toString()))
    .required("Step Type is required"),
  transport: Yup.string().required("Transporter is required"),
});

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

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues: ISupplyChainSchema = useMemo(
    () => ({
      id: currentProduct?.id,
      name: currentProduct?.name || "",
      description: currentProduct?.description || "",
      steps: currentProduct?.steps || [],
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewSupplyChainSchema),
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
      console.log("DATA: ", data);
      reset();
      enqueueSnackbar(currentProduct ? "Update success!" : "Create success!");
      router.push(paths.dashboard.product.root);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <CheckoutSteps activeStep={checkout.activeStep} steps={STEPS} />

      {checkout.activeStep === 0 && <CheckoutBasic />}

      {checkout.activeStep === 1 && <CheckoutSelectItems />}

      {checkout.activeStep === 2 && <CheckoutConfigureSteps />}

      {checkout.activeStep === 3 && <CheckoutPreviewSteps />}
    </FormProvider>
  );
}
