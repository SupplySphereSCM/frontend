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
import { ISupplyChainItem, ISupplyChainSchema } from "src/types/supplychain";

import { useCheckoutContext } from "./context";

import CheckoutBasic from "./checkout-basic";
import CheckoutSteps from "./checkout-steps";
import CheckoutSelectItems from "./checkout-select-items";

// ----------------------------------------------------------------------

export const STEPS = [
  "Basic Info",
  "Select Items",
  "Configure Steps",
  "Preview",
];

// ----------------------------------------------------------------------

type Props = {
  currentProduct?: ISupplyChainItem;
};

export default function SupplyChainNewEditForm({ currentProduct }: Props) {
  const router = useRouter();

  const checkout = useCheckoutContext();

  const { enqueueSnackbar } = useSnackbar();

  const NewSupplyChainSchema = Yup.object<ISupplyChainSchema>().shape({
    id: Yup.string(),
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
  });

  const defaultValues: ISupplyChainSchema = useMemo(
    () => ({
      id: currentProduct?.id,
      name: currentProduct?.name || "",
      description: currentProduct?.description || "",
    }),
    [currentProduct],
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
    </FormProvider>
  );
}
