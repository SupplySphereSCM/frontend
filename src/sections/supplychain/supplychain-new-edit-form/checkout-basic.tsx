// @mui
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
// hooks
import { useResponsive } from "src/hooks/use-responsive";
import { RHFEditor, RHFTextField } from "src/components/hook-form";
//types
import { useCheckoutContext } from "./context";

// ----------------------------------------------------------------------

export default function CheckoutBasic() {
  const checkout = useCheckoutContext();

  const mdUp = useResponsive("up", "md");

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Name" />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="description" />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: "flex", alignItems: "center" }}>
        <Box flex={1} />

        <Button variant="contained" size="large" onClick={checkout.onNextStep}>
          Continue
        </Button>
      </Grid>
    </>
  );

  return (
    <Grid container spacing={3}>
      {renderDetails}

      {renderActions}
    </Grid>
  );
}
