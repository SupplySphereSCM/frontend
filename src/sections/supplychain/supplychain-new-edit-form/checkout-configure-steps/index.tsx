// @mui
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
// _mock
import { _addressBooks } from "src/_mock";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// components
import Iconify from "src/components/iconify";
import { useCheckoutContext } from "../context";
import StepForm from "./step-form";

// ----------------------------------------------------------------------

export default function CheckoutConfigureSteps() {
  const checkout = useCheckoutContext();

  const stepForm = useBoolean();

  return (
    <>
      <Button
        fullWidth
        onClick={stepForm.onTrue}
        sx={{ borderWidth: 1, borderStyle: "dashed", py: 1 }}
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
