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
import { Autocomplete, TextField } from "@mui/material";
import ComponentBlock from "src/sections/_examples/component-block";
import { useCheckoutContext } from "../context";
import { useLocalStorage, getStorage } from "src/hooks/use-local-storage";
import {
  IServiceFilterValue,
  IServiceItem,
  ITransporterServiceItem,
} from "src/types/service";
import { useAuthContext } from "src/auth/hooks";
import { IRawMaterialItem } from "src/types/raw-materials";

// ----------------------------------------------------------------------
const STORAGE_KEY = "checkout";

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onCreate: (step: ISupplyChainStepItem) => void;
};

const stepType = [{ title: "Procuring" }, { title: "Servicing" }];

export default function StepForm({ open, onClose, onCreate }: Props) {
  const methods = useForm({
    resolver: yupResolver(NewStepSchema),
  });

  const { control } = useFormContext<ISupplyChainSchema>();
  const { onAddLogistics } = useCheckoutContext();
  const { materials, services, logistics } = getStorage(STORAGE_KEY);
  const productsAndServices: (IServiceItem | IRawMaterialItem)[] = [
    ...materials,
    ...services,
  ];
  console.log(productsAndServices);

  const value = getStorage(STORAGE_KEY);
  console.log(value);

  // console.log("logi", logistics);
  // console.log("materi", materials);
  // console.log("service", services);

  const { append } = useFieldArray({
    control,
    name: "steps",
  });

  const onSubmit = methods.handleSubmit((data) => {
    console.log("Clicked", data);

    append(data as ISupplyChainStepItem);
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>New Step</DialogTitle>

        <DialogContent dividers>
          {/* <Stack spacing={3}>
            <RHFTextField name="from" />
          </Stack> */}
          <ComponentBlock title="Combo box">
            <RHFAutocomplete
              name="from"
              label="From"
              fullWidth
              options={productsAndServices?.map(
                (productAndService) => productAndService?.user?.firstName
              )}
              // getOptionLabel={(service) => service.name}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                // const { code, label, phone } = countries.filter(
                //   (country) => country.label === option
                // )[0];

                // if (!label) {
                //   return null;
                // }
                console.log(option);

                return (
                  <li {...props} key={option}>
                    {/* <Iconify
                      key={label}
                      icon={`circle-flags:${code.toLowerCase()}`}
                      width={28}
                      sx={{ mr: 1 }}
                    /> */}
                    {option}
                  </li>
                );
              }}
            />
            <RHFAutocomplete
              name="to"
              label="To"
              fullWidth
              options={productsAndServices?.map(
                (productAndService) => productAndService?.user?.firstName
              )}
              // getOptionLabel={(service) => service.name}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                // const { code, label, phone } = countries.filter(
                //   (country) => country.label === option
                // )[0];

                // if (!label) {
                //   return null;
                // }

                return (
                  <li {...props} key={option}>
                    {/* <Iconify
                      key={label}
                      icon={`circle-flags:${code.toLowerCase()}`}
                      width={28}
                      sx={{ mr: 1 }}
                    /> */}
                    {option}
                  </li>
                );
              }}
            />
            <RHFAutocomplete
              name="stepType"
              label="Step Type"
              fullWidth
              options={stepType.map((type) => type.title)}
              // getOptionLabel={(option) => option.title}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                // const { code, label, phone } = countries.filter(
                //   (country) => country.label === option
                // )[0];

                // if (!label) {
                //   return null;
                // }

                return (
                  <li {...props} key={option}>
                    {/* <Iconify
                      key={label}
                      icon={`circle-flags:${code.toLowerCase()}`}
                      width={28}
                      sx={{ mr: 1 }}
                    /> */}
                    {option}
                  </li>
                );
              }}
            />
            <RHFAutocomplete
              name="transport"
              label="Transport"
              fullWidth
              options={logistics.map(
                (logistic: ITransporterServiceItem) => logistic.name
              )}
              // getOptionLabel={(service) => service.name}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                // const { code, label, phone } = countries.filter(
                //   (country) => country.label === option
                // )[0];

                // if (!label) {
                //   return null;
                // }
                // console.log(option);

                return (
                  <li {...props} key={option}>
                    {/* <Iconify
                      key={label}
                      icon={`circle-flags:${code.toLowerCase()}`}
                      width={28}
                      sx={{ mr: 1 }}
                    /> */}
                    {option}
                  </li>
                );
              }}
            />

            <RHFAutocomplete
              name="rawMaterial"
              label="Raw Material"
              fullWidth
              options={materials.map(
                (material: ITransporterServiceItem) => material.name
              )}
              // getOptionLabel={(service) => service.name}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                // const { code, label, phone } = countries.filter(
                //   (country) => country.label === option
                // )[0];

                // if (!label) {
                //   return null;
                // }

                return (
                  <li {...props} key={option}>
                    {/* <Iconify
                      key={label}
                      icon={`circle-flags:${code.toLowerCase()}`}
                      width={28}
                      sx={{ mr: 1 }}
                    /> */}
                    {option}
                  </li>
                );
              }}
            />
            <RHFAutocomplete
              name="service"
              label="Service"
              fullWidth
              options={services.map(
                (service: ITransporterServiceItem) => service.name
              )}
              // getOptionLabel={(service) => service.name}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                // const { code, label, phone } = countries.filter(
                //   (country) => country.label === option
                // )[0];

                // if (!label) {
                //   return null;
                // }

                return (
                  <li {...props} key={option}>
                    {/* <Iconify
                      key={label}
                      icon={`circle-flags:${code.toLowerCase()}`}
                      width={28}
                      sx={{ mr: 1 }}
                    /> */}
                    {option}
                  </li>
                );
              }}
            />
            {/* <Autocomplete
              fullWidth
              options={from}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField {...params} label="From" margin="none" />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.title}>
                  {option.title}
                </li>
              )}
            /> */}

            {/*<Autocomplete
              fullWidth
              options={from}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField {...params} label="To " margin="none" />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.title}>
                  {option.title}
                </li>
              )}
            />

            <Autocomplete
              fullWidth
              options={stepType}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField {...params} label="Step Type" margin="none" />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.title}>
                  {option.title}
                </li>
              )}
            />
            <Autocomplete
              fullWidth
              options={from}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField {...params} label="Transporter" margin="none" />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.title}>
                  {option.title}
                </li>
              )}
            /> */}
          </ComponentBlock>
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
