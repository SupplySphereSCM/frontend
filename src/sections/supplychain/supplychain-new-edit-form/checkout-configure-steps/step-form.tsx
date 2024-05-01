import * as Yup from "yup";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
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
import {
  ISupplyChainSchema,
  ISupplyChainStepItem,
} from "src/types/supplychain";
// components
import Iconify from "src/components/iconify";
import FormProvider, {
  RHFCheckbox,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from "src/components/hook-form";

import { NewStepSchema } from "..";

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onCreate: (step: ISupplyChainStepItem) => void;
};

export default function StepForm({ open, onClose, onCreate }: Props) {
  const methods = useForm({
    resolver: yupResolver(NewStepSchema),
  });

  const { control } = useFormContext<ISupplyChainSchema>();

  const { append } = useFieldArray({
    control,
    name: "steps",
  });

  const onSubmit = methods.handleSubmit((data) => {
    append(data as ISupplyChainStepItem);
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>New Step</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <RHFTextField name="from" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained">
            Add Step
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
