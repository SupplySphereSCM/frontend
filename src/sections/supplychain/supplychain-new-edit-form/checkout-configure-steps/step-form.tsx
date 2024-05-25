import * as Yup from "yup";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import LoadingButton from "@mui/lab/LoadingButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
//type
import {
  ISupply,
  ISupplyChainSchema,
  ISupplyChainStepItem,
  ISupplyChainStepLabel,
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
import { useState } from "react";

// ----------------------------------------------------------------------
const STORAGE_KEY = "checkout";

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onCreate: (step: ISupplyChainStepItem) => void;
};

const stepType = [{ title: "PROCURING" }, { title: "SERVICING" }];

export default function StepForm({ open, onClose, onCreate }: Props) {
  const methods = useForm({
    resolver: yupResolver(NewStepSchema),
  });
  const { control } = useFormContext<ISupplyChainSchema>();
  // const { reset } = useFormContext();
  const { user } = useAuthContext();
  const [selectedStepType, setSelectedStepType] = useState<string>("");

  const { reset } = methods;
  const handleStepTypeChange = (
    event: React.ChangeEvent<{}>,
    value: string | null
  ) => {
    setSelectedStepType(value || "");
  };

  const { materials, services, logistics } = getStorage(STORAGE_KEY);

  const productsAndServices: (IServiceItem | IRawMaterialItem)[] = [
    ...materials,
    ...services,
    { user: user },
  ];

  const value = getStorage(STORAGE_KEY);
  console.log(value.services);

  // console.log("logi", logistics);
  // console.log("materi", materials);
  // console.log("service", services);
  type ISupplyChainSchema = {
    steps: ISupplyChainStepItem[];
    stepArray: ISupplyChainStepLabel[]; // Add your new property here
  };

  const { append } = useFieldArray({
    control,
    name: "steps",
  });

  const { append: stepArrayAppend } = useFieldArray({
    control,
    name: "stepArray",
  });

  const onSubmit = methods.handleSubmit((data) => {
    // console.log("Clicked", data);

    const selectedService = services.find(
      (service: IServiceItem) => service.id === data.service?.value
    );
    // console.log("selectedService:", selectedService);

    const serviceQuantity = selectedService?.quantity || 0;
    const serviceCost = selectedService?.price * serviceQuantity;

    const selectedMaterial = materials.find(
      (material: IServiceItem) => material.id === data?.rawMaterial?.value
    );
    // console.log("selectedMaterial:", selectedMaterial);

    const MaterialQuantity = selectedMaterial?.quantity || 0;
    const materialCost = selectedMaterial?.price * MaterialQuantity;

    const selectedLogistics = logistics.find(
      (logistic: ITransporterServiceItem) =>
        logistic.id === data?.transport?.value
    );
    const logisticCost = selectedLogistics?.priceWithinState;
    // console.log("selectedLogistics:", selectedLogistics);
    // console.log(materialCost);
    // console.log(serviceCost);
    // console.log(logisticCost);

    append({
      from: data.from,
      to: data.to,
      transport: data.transport,
      stepType: data.stepType,
      service: data.stepType === "PROCURING" ? null : data.service,
      rawMaterial: data.stepType === "SERVICING" ? null : data.rawMaterial,
      product: data.product,
      quantity:
        data.stepType === "SERVICING" ? serviceQuantity : MaterialQuantity,
      totalStepAmount:
        data.stepType === "SERVICING"
          ? serviceCost + logisticCost
          : materialCost + logisticCost,
    } as ISupply);

    stepArrayAppend({
      from: data?.from?.label,
      to: data?.to.label,
      transport: data.transport.label,
      stepType: data.stepType,
      service: data.stepType === "PROCURING" ? null : data.service?.label,
      rawMaterial:
        data.stepType === "SERVICING" ? null : data.rawMaterial?.label,
      product: data.product?.label,
      quantity:
        data.stepType === "SERVICING" ? serviceQuantity : MaterialQuantity,
      totalStepAmount:
        data.stepType === "SERVICING"
          ? serviceCost + logisticCost
          : materialCost + logisticCost,
    } as ISupplyChainStepLabel);
    onClose();
    reset();
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods}>
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
              // options={productsAndServices?.map(
              //   (productAndService) => productAndService?.user?.firstName
              // )}
              options={productsAndServices?.map((productAndService) => ({
                label: productAndService?.user?.firstName,
                value: productAndService?.user?.id,
              }))}
              // getOptionLabel={(service) => service.name}
              // isOptionEqualToValue={(option, value) => option === value}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                );
              }}
            />
            <RHFAutocomplete
              name="to"
              label="To"
              fullWidth
              // options={productsAndServices?.map(
              //   (productAndService) => productAndService?.user?.firstName
              // )}
              options={productsAndServices?.map((productAndService) => ({
                label: productAndService?.user?.firstName,
                value: productAndService?.user?.id,
              }))}
              // getOptionLabel={(service) => service.name}
              // isOptionEqualToValue={(option, value) => option === value}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderOption={(props, option) => {
                // const { code, label, phone } = countries.filter(
                //   (country) => country.label === option
                // )[0];

                // if (!label) {
                //   return null;
                // }

                return (
                  <li {...props} key={option.value}>
                    {/* <Iconify
                      key={label}
                      icon={`circle-flags:${code.toLowerCase()}`}
                      width={28}
                      sx={{ mr: 1 }}
                    /> */}
                    {option.label}
                  </li>
                );
              }}
            />
            {/* <Autocomplete
              componentName="stepType"
              fullWidth
              options={stepType}
              onInputChange={handleStepTypeChange}
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
            <RHFAutocomplete
              name="stepType"
              label="Step Type"
              fullWidth
              options={stepType.map((type) => type.title)}
              // getOptionLabel={(option) => option.title}
              isOptionEqualToValue={(option, value) => option === value}
              onInputChange={handleStepTypeChange}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option}>
                    {option}
                  </li>
                );
              }}
            />
            <RHFAutocomplete
              name="transport"
              label="Transport"
              fullWidth
              // options={logistics.map(
              //   (logistic: ITransporterServiceItem) => logistic.name
              // )}
              options={logistics.map((logistic: ITransporterServiceItem) => ({
                label: logistic.name,
                value: logistic.id,
              }))}
              // getOptionLabel={(service) => service.name}
              // isOptionEqualToValue={(option, value) => option === value}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                );
              }}
            />

            {selectedStepType === "PROCURING" && (
              <RHFAutocomplete
                name="rawMaterial"
                label="Raw Material"
                fullWidth
                // options={materials.map(
                //   (material: IRawMaterialItem) => material.name
                // )}
                options={materials?.map((material: IRawMaterialItem) => ({
                  label: material?.name,
                  value: material?.id,
                }))}
                // getOptionLabel={(service) => service.name}
                // isOptionEqualToValue={(option, value) => option === value}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                renderOption={(props, option) => {
                  // const { code, label, phone } = countries.filter(
                  //   (country) => country.label === option
                  // )[0];

                  // if (!label) {
                  //   return null;
                  // }

                  return (
                    <li {...props} key={option.value}>
                      {/* <Iconify
                      key={label}
                      icon={`circle-flags:${code.toLowerCase()}`}
                      width={28}
                      sx={{ mr: 1 }}
                    /> */}
                      {option.label}
                    </li>
                  );
                }}
              />
            )}
            {selectedStepType === "SERVICING" && (
              <RHFAutocomplete
                name="service"
                label="Service"
                fullWidth
                // options={services.map(
                //   (service: ITransporterServiceItem) => service.name
                // )}
                options={services?.map((service: IServiceItem) => ({
                  label: service?.name,
                  value: service?.id,
                }))}
                // getOptionLabel={(service) => service.name}
                // isOptionEqualToValue={(option, value) => option === value}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                renderOption={(props, option) => {
                  // const { code, label, phone } = countries.filter(
                  //   (country) => country.label === option
                  // )[0];

                  // if (!label) {
                  //   return null;
                  // }

                  return (
                    <li {...props} key={option.value}>
                      {/* <Iconify
                      key={label}
                      icon={`circle-flags:${code.toLowerCase()}`}
                      width={28}
                      sx={{ mr: 1 }}
                    /> */}
                      {option.label}
                    </li>
                  );
                }}
              />
            )}
            {/* <Stack direction="row">
              <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                Quantity
              </Typography>

              <Stack spacing={1}>
                <IncrementerButton
                  name="quantity"
                  quantity={values.quantity}
                  disabledDecrease={values.quantity <= 1}
                  disabledIncrease={values.quantity >= available}
                  onIncrease={() => setValue("quantity", values.quantity + 1)}
                  onDecrease={() => setValue("quantity", values.quantity - 1)}
                />

                <Typography
                  variant="caption"
                  component="div"
                  sx={{ textAlign: "right" }}
                >
                  Available: {available}
                </Typography>
              </Stack>
            </Stack> */}
            {/* <RHFTextField
              name="quantity"
              label="Quantity(in units)"
              placeholder="0"
              type="number"
              InputLabelProps={{ shrink: true }}
            /> */}
            {/* <Autocomplete
              componentName="stepType"
              fullWidth
              options={from}
              onChange={handleStepTypeChange}
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

          <LoadingButton onClick={onSubmit} variant="contained">
            Add Step
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
