import { useFormContext } from "react-hook-form";
// @mui
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
// _mock
import { _addressBooks, _mock } from "src/_mock";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// components
import Iconify from "src/components/iconify";
//types
import {
  ISupplyChainSchema,
  ISupplyChainStepLabel,
} from "src/types/supplychain";

import StepForm from "./step-form";
import SupplychainStepsTable from "./step-card";

import { useCheckoutContext } from "../context";
// ----------------------------------------------------------------------

export default function CheckoutConfigureSteps() {
  const checkout = useCheckoutContext();

  const stepForm = useBoolean();

  const { watch } = useFormContext<ISupplyChainSchema>();

  const steps = watch("steps");

  return (
    <>
      {/* {steps.map((step) => ( */}
      {/* <> */}
      <Grid xs={12} md={6} lg={8}>
        <SupplychainStepsTable
          title="Supplychain Steps"
          tableData={steps}
          tableLabels={[
            { id: "from", label: "From" },
            { id: "to", label: "To" },
            { id: "transport", label: "Transporter", align: "center" },
            { id: "particulars", label: "Particulars", align: "right" },
            { id: "stepType", label: "Step Type", align: "right" },
          ]}
        />
      </Grid>
      <Button
        fullWidth
        onClick={stepForm.onTrue}
        sx={{ mt: 5, borderWidth: 1, borderStyle: "dashed", py: 1 }}
      >
        Add Step
      </Button>

      <Stack direction="row" justifyContent="space-between" mt={3}>
        <Button
          size="small"
          color="inherit"
          onClick={checkout.onBackStep}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Back
        </Button>

        <Button
          size="small"
          variant="contained"
          color="inherit"
          onClick={checkout.onNextStep}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        >
          Continue
        </Button>
      </Stack>

      <StepForm
        open={stepForm.value}
        onClose={stepForm.onFalse}
        onCreate={(step) => console.log("NEW STEP:", step)}
      />
    </>
  );
}
