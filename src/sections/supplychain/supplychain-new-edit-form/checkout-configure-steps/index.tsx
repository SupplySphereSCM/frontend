// @mui
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
// _mock
import { _addressBooks, _mock } from "src/_mock";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// components
import Iconify from "src/components/iconify";
import { useCheckoutContext } from "../context";
import StepForm from "./step-form";
import { useFormContext } from "react-hook-form";
import {
  ISupplyChainSchema,
  ISupplyChainStepItem,
} from "src/types/supplychain";
import { Typography } from "@mui/material";
import SupplychainStepsTable from "./step-card";

// ----------------------------------------------------------------------

// export const _ecommerceBestSalesman = [...Array(5)].map((_, index) => {
//   const category = [
//     "CAP",
//     "Branded Shoes",
//     "Headphone",
//     "Cell Phone",
//     "Earings",
//   ][index];

//   const flag = [
//     "flagpack:de",
//     "flagpack:gb-nir",
//     "flagpack:fr",
//     "flagpack:kr",
//     "flagpack:us",
//   ][index];

//   return {
//     id: _mock.id(index),
//     flag,
//     category,
//     rank: `Top ${index + 1}`,
//     email: _mock.email(index),
//     name: _mock.fullName(index),
//     totalAmount: _mock.number.price(index),
//     avatarUrl: _mock.image.avatar(index + 8),
//   };
// });

export default function CheckoutConfigureSteps() {
  const checkout = useCheckoutContext();

  const stepForm = useBoolean();

  const { watch } = useFormContext<ISupplyChainSchema>();

  const steps = watch("steps");
  console.log(steps);

  return (
    <>
      {/* {steps.map((step) => ( */}
      {/* <> */}
      <Grid xs={12} md={6} lg={8}>
        <SupplychainStepsTable
          title="Supplychain Steps"
          tableData={steps as ISupplyChainStepItem[]}
          tableLabels={[
            { id: "from", label: "From" },
            { id: "to", label: "To" },
            { id: "transport", label: "Transporter", align: "center" },
            { id: "product", label: "Product", align: "right" },
            { id: "service", label: "Service", align: "right" },
            { id: "stepType", label: "Step Type", align: "right" },
          ]}
        />
      </Grid>
      {/* <Typography>{step.from}</Typography>
          <Typography>{step.to}</Typography>
          <Typography>{step.transport}</Typography>
          <Typography>{step.rawMaterial}</Typography>
          <Typography>{step.service}</Typography> */}
      {/* </> */}
      {/* ))} */}
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
