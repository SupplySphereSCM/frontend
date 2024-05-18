import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useMemo, useEffect, useState } from "react";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
// routes
import { paths } from "src/routes/paths";
// hooks
import { useResponsive } from "src/hooks/use-responsive";
import { useAuthContext } from "src/auth/hooks";
// _mock
import { _tags, CAPACITY_OPTIONS } from "src/_mock";
// API
import { createService, updateService } from "src/api/service";
// components
import { useSnackbar } from "src/components/snackbar";
import { useRouter } from "src/routes/hooks";
import FormProvider, {
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
} from "src/components/hook-form";
// types
import {
  IServiceItem,
  IServiceSchema,
  ITransporterServiceItem,
} from "src/types/service";
// wagmi
// import { BigInt } from "@wagmi/core";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "src/web3/wagmi.config";

import { ServicesABI, addresses as servicesAddress } from "src/abi/services";

// ----------------------------------------------------------------------

type Props = {
  currentService?: IServiceItem;
};

export default function ServiceNewEditForm({ currentService }: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();
  const { writeContractAsync } = useWriteContract();
  const { address, chainId } = useAccount();

  const [quantity, setQuantity] = useState("");

  const [includeTaxes, setIncludeTaxes] = useState(false);

  // const [volume, setVolume] = useState("");

  const NewServiceSchema = Yup.object<IServiceSchema>().shape({
    id: Yup.string(),
    name: Yup.string().required("Name is required"),
    price: Yup.number().moreThan(0, "Price should not be $0.00"),
    description: Yup.string().required("Description is required"),
    tax: Yup.number(),
    subDescription: Yup.string().required("Sub Description is required"),
    type: Yup.string(),
    quantity: Yup.number().required("Quantity is required"),
    volume: Yup.number().required("Volume is required"),
    transactionHash: Yup.string(),
    eid: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentService?.name || "",
      description: currentService?.description || "",
      subDescription: currentService?.subDescription || "",
      price: currentService?.price || 0,
      tax: currentService?.tax || 0,
      quantity: currentService?.quantity || 0,
      volume: currentService?.volume || 0,
      id: currentService?.id,
      type: currentService?.type || "Quantity",
      transactionHash: currentService?.transactionHash || Date.now().toString(),
      eid: currentService?.eid || "",
    }),
    [currentService],
  );

  const methods = useForm({
    resolver: yupResolver(NewServiceSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentService) {
      reset(defaultValues);
    }
  }, [currentService, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue("tax", 0);
    } else {
      setValue("tax", currentService?.tax || 0);
    }
  }, [currentService?.tax, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentService?.id) {
        await updateService(data as IServiceItem);
      }
      // console.log(data);
      else {
        const hash = await writeContractAsync({
          abi: ServicesABI,
          address: servicesAddress[`${chainId}`] as `0x${string}`,
          functionName: "addService",
          args: [
            data.name,
            BigInt(data?.price!),
            BigInt(data?.tax!),
            BigInt(data?.quantity),
            BigInt(data?.volume),
          ],
          // args: [data?.name, BigInt(data?.price), data?.tax, data?.quantity],
          // @ts-ignore
        });
        const { transactionHash } = await waitForTransactionReceipt(config, {
          hash,
        });
        data.eid = hash;
        data.transactionHash = transactionHash;
        await createService(data as IServiceItem);
      }
      reset();
      enqueueSnackbar(currentService ? "Update success!" : "Create success!");
      router.push(paths.dashboard.service.root);
    } catch (error) {
      console.error(error);
    }
  });

  // const handleDrop = useCallback(
  //   (acceptedFiles: File[]) => {
  //     const file = acceptedFiles[0];

  //     const newFile = Object.assign(file, {
  //       preview: URL.createObjectURL(file),
  //     });
  //     // console.log(newFile);

  //     setValue("images", newFile.preview, { shouldValidate: true });
  //   },
  //   [setValue]
  // );

  // const handleRemoveFile = useCallback(() => {
  //   setValue("images", "");
  // }, [setValue]);

  // const handleRemoveAllFiles = useCallback(() => {
  //   setValue("images", []);
  // }, [setValue]);

  // Handler for radio button change
  const handleTypeChange = (event: { target: { value: any } }) => {
    const selectedType = event.target.value;
    if (selectedType === "Volume") {
      setQuantity(""); // Clear volume if switching to Quantity
    }
  };

  const handleChangeIncludeTaxes = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIncludeTaxes(event.target.checked);
    },
    [],
  );

  // const handleImageUpload = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("files", values.images as any);
  //     await axiosInstance.post(endpoints.upload.files, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     enqueueSnackbar("Image Uploaded", { variant: "success" });
  //   } catch (error) {
  //     enqueueSnackbar("Image Upload Failed", { variant: "error" });
  //   }
  // };

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Title, short description...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Service Name" />
            {/* <RHFTextField name="transactionHash" label="Transaction Hash" /> */}

            <RHFTextField
              name="subDescription"
              label="Sub Description"
              multiline
              rows={4}
            />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="description" />
            </Stack>

            {/* <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              <RHFUpload
                // multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                // onRemoveAll={handleRemoveAllFiles}
                onUpload={handleImageUpload}
              />
            </Stack> */}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Type</Typography>
              <RHFRadioGroup
                row
                spacing={4}
                name="type"
                options={CAPACITY_OPTIONS}
                // onChange={handleTypeChange}
              />
            </Stack>
          </Stack>

          {!mdUp && <CardHeader title={values.type} />}
          {values.type === "Quantity" ? (
            <Stack spacing={3} sx={{ p: 3 }}>
              <RHFTextField name="quantity" label="Quantity" />
            </Stack>
          ) : (
            <Stack spacing={3} sx={{ p: 3 }}>
              <RHFTextField name="volume" label="Volume" />
            </Stack>
          )}
          {/* 
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="price"
              label="Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: "text.disabled" }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </Stack> */}
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Pricing
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Price related inputs
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="price"
              label="Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: "text.disabled" }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            {/* <RHFTextField
              name="priceSale"
              label="Sale Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: "text.disabled" }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            /> */}

            <FormControlLabel
              control={
                <Switch
                  checked={includeTaxes}
                  onChange={handleChangeIncludeTaxes}
                />
              }
              label="Price includes tax"
            />

            {!includeTaxes && (
              <RHFTextField
                name="tax"
                label="Tax (%)"
                placeholder="0.00"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: "text.disabled" }}>
                        %
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: "flex", alignItems: "center" }}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentService ? "Create Service" : "Save Changes"}
        </LoadingButton>
      </Grid>
    </>
  );

  // const renderTransporterDetails = (
  //   <>
  //     {mdUp && (
  //       <Grid md={4}>
  //         <Typography variant="h6" sx={{ mb: 0.5 }}>
  //           Details
  //         </Typography>
  //         <Typography variant="body2" sx={{ color: "text.secondary" }}>
  //           Title, short description, image...
  //         </Typography>
  //       </Grid>
  //     )}

  //     <Grid xs={12} md={8}>
  //       <Card>
  //         {!mdUp && <CardHeader title="Details" />}

  //         <Stack spacing={3} sx={{ p: 3 }}>
  //           <RHFTextField name="name" label="Transporter Service Name" />

  //           <RHFTextField
  //             name="subDescription"
  //             label="Sub Description"
  //             multiline
  //             rows={4}
  //           />

  //           <Stack spacing={1.5}>
  //             <RHFTextField
  //               name="priceWithInState"
  //               label="Price With In State"
  //             />
  //           </Stack>
  //           <Stack spacing={1.5}>
  //             <RHFTextField name="priceInterState" label="Price Inter State" />
  //           </Stack>
  //           <Stack spacing={1.5}>
  //             <RHFTextField
  //               name="priceInternational"
  //               label="Price International"
  //             />
  //           </Stack>

  //           {/* <Stack spacing={1.5}>
  //           <Typography variant="subtitle2">Images</Typography>
  //           <RHFUpload
  //             // multiple
  //             thumbnail
  //             name="images"
  //             maxSize={3145728}
  //             onDrop={handleDrop}
  //             onRemove={handleRemoveFile}
  //             // onRemoveAll={handleRemoveAllFiles}
  //             onUpload={handleImageUpload}
  //           />
  //         </Stack> */}
  //         </Stack>
  //       </Card>
  //     </Grid>
  //   </>
  // );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderPricing}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
