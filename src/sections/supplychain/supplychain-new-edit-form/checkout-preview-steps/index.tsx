// @mui
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
//components
import Iconify from "src/components/iconify";
import SupplychainStepsTable from "../checkout-configure-steps/step-card";
import FormProvider from "src/components/hook-form";
//hooks
import { useCheckoutContext } from "../context";
import { NewSupplyChainSchema } from "..";
// types
import {
  ISupplyChainSchema,
  ISupplyChainStepItem,
  ISupplyChainStepLabel,
} from "src/types/supplychain";
// form
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export default function CheckoutPreviewSteps() {
  const { onReset, onBackStep } = useCheckoutContext();
  const { watch, control, handleSubmit } = useFormContext<ISupplyChainSchema>();

  const stepArray = watch("stepArray");
  // console.log("stepArray:", stepArray);

  const handleReset = () => {
    console.log("clicked");
    onReset();
  };

  // const { append } = useFieldArray({
  //   control,
  //   name: "steps",
  // });

  const onSubmit = (data: ISupplyChainSchema) => {
    try {
      console.log("DATA: ", data);
      // createSupplyChain(data);
      // reset();
      // enqueueSnackbar(currentProduct ? "Update success!" : "Create success!");
      // router.push(paths.dashboard.product.root);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Typography>Preview the Form</Typography>
      <Grid xs={12} md={6} lg={8}>
        <SupplychainStepsTable
          title="Supplychain Steps"
          tableData={stepArray as ISupplyChainStepLabel[]}
          tableLabels={[
            { id: "from", label: "From" },
            { id: "to", label: "To" },
            { id: "transport", label: "Transporter", align: "center" },
            { id: "particulars", label: "particulars", align: "right" },
            { id: "stepType", label: "Step Type", align: "right" },
          ]}
        />
      </Grid>

      <Stack
        direction="column"
        justifyContent="space-between"
        spacing={2}
        sx={{ mt: 3 }}
      >
        <Button color="success" type="submit">
          Submit
        </Button>
      </Stack>
      <Stack direction="row" justifyContent="space-between" mt={3}>
        <Button
          size="small"
          color="inherit"
          onClick={onBackStep}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Back
        </Button>
        <Button
          size="large"
          color="warning"
          variant="contained"
          startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
          onClick={handleReset}
          sx={{ whiteSpace: "nowrap" }}
        >
          Reset
        </Button>
      </Stack>
    </>
  );
}
