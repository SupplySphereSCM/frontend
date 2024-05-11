// @mui
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
//components
import Iconify from "src/components/iconify";
import SupplychainStepsTable from "./step-card";
//hooks
import { useCheckoutContext } from "../context";
import { useFormContext } from "react-hook-form";
// types
import {
  ISupplyChainSchema,
  ISupplyChainStepItem,
} from "src/types/supplychain";
export default function CheckoutPreviewSteps() {
  const { onReset } = useCheckoutContext();
  const { watch } = useFormContext<ISupplyChainSchema>();

  const steps = watch("steps");
  const handleReset = () => {
    console.log("clicked");
    onReset();
  };
  return (
    <>
      <Typography>Preview the Form</Typography>
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
      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
        <Button
          fullWidth
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
