import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
//type
import { ISupplyChainStepItem } from "src/types/supplychain";
// components
import Iconify from "src/components/iconify";
import FormProvider, {
  RHFCheckbox,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from "src/components/hook-form";

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onCreate: (step: ISupplyChainStepItem) => void;
};

export default function StepForm({ open, onClose, onCreate }: Props) {
  const NewStepSchema = Yup.object().shape<ISupplyChainStepItem>({});

  const defaultValues: ISupplyChainStepItem = {};

  const methods = useForm({
    resolver: yupResolver(NewStepSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      onCreate({});
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>New Step</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>test</Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Add Step
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
