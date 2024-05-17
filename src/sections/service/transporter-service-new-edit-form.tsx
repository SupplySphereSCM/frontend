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
// _mock
import { _tags, CAPACITY_OPTIONS } from "src/_mock";
// API
import {
  createService,
  createTransportService,
  updateTransporterService,
} from "src/api/service";
// components
import { useSnackbar } from "src/components/snackbar";
import { useRouter } from "src/routes/hooks";
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFRadioGroup,
} from "src/components/hook-form";
// types
import {
  IServiceItem,
  ITransporterServiceItem,
  ITransporterServiceSchema,
} from "src/types/service";

import axiosInstance, { endpoints } from "src/utils/axios";
// wagmi
// import { BigInt } from "@wagmi/core";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "src/web3/wagmi.config";
import { LogisticsABI, addresses as logisticsAddress } from "src/abi/logistics";

// ----------------------------------------------------------------------

type Props = {
  currentTransportService?: ITransporterServiceItem;
};

export default function TransporterServiceNewEditForm({
  currentTransportService,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const { writeContractAsync } = useWriteContract();

  const { chainId } = useAccount();

  const NewServiceSchema = Yup.object<ITransporterServiceSchema>().shape({
    id: Yup.string(),
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    priceWithinState: Yup.number().moreThan(0, "Price should not be $0.00"),
    priceInterState: Yup.number().moreThan(0, "Price should not be $0.00"),
    priceInternationl: Yup.number().moreThan(0, "Price should not be $0.00"),
    transactionHash: Yup.string(),
    eid: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentTransportService?.id,
      name: currentTransportService?.name || "",
      description: currentTransportService?.description || "",
      eid: currentTransportService?.eid || "",
      priceWithinState: currentTransportService?.priceWithinState || 0,
      priceInterState: currentTransportService?.priceInterState || 0,
      priceInternationl: currentTransportService?.priceInternationl || 0,
      transactionHash:
        currentTransportService?.transactionHash || Date.now().toString(),
    }),
    [currentTransportService]
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
    if (currentTransportService) {
      reset(defaultValues);
    }
  }, [currentTransportService, defaultValues, reset]);

  // useEffect(() => {
  //   if (includeTaxes) {
  //     setValue("tax", 0);
  //   } else {
  //     setValue("tax", currentTransportService?.tax || 0);
  //   }
  // }, [currentTransportService?.tax, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));

      if (currentTransportService?.id) {
        await updateTransporterService(data as ITransporterServiceItem);
      } else {
        const hash = await writeContractAsync({
          abi: LogisticsABI,
          address: logisticsAddress[`${chainId}`] as `0x${string}`,
          functionName: "addLogistics",
          args: [data.name, BigInt(data?.priceWithinState!)],
          // args: [data?.name, BigInt(data?.price), data?.tax, data?.quantity],
          // @ts-ignore
        });
        const { transactionHash } = await waitForTransactionReceipt(config, {
          hash,
        });
        data.eid = hash;
        data.transactionHash = transactionHash;

        await createTransportService(data as ITransporterServiceItem);
      }

      reset();
      enqueueSnackbar(
        currentTransportService ? "Update success!" : "Create success!"
      );
      router.push(paths.dashboard.service.root);
      console.info("DATA", data);
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
  // const handleTypeChange = (event: { target: { value: any } }) => {
  //   const selectedType = event.target.value;
  //   if (selectedType === "Volume") {
  //     setQuantity(""); // Clear volume if switching to Quantity
  //   }
  // };

  // const handleChangeIncludeTaxes = useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setIncludeTaxes(event.target.checked);
  //   },
  //   []
  // );

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

  // const renderDetails = (
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
  //           <RHFTextField name="name" label="Service Name" />

  //           <RHFTextField
  //             name="subDescription"
  //             label="Sub Description"
  //             multiline
  //             rows={4}
  //           />

  //           <Stack spacing={1.5}>
  //             <Typography variant="subtitle2">Content</Typography>
  //             <RHFEditor simple name="description" />
  //           </Stack>

  //           {/* <Stack spacing={1.5}>
  //             <Typography variant="subtitle2">Images</Typography>
  //             <RHFUpload
  //               // multiple
  //               thumbnail
  //               name="images"
  //               maxSize={3145728}
  //               onDrop={handleDrop}
  //               onRemove={handleRemoveFile}
  //               // onRemoveAll={handleRemoveAllFiles}
  //               onUpload={handleImageUpload}
  //             />
  //           </Stack> */}
  //         </Stack>
  //       </Card>
  //     </Grid>
  //   </>
  // );

  // const renderProperties = (
  //   <>
  //     {mdUp && (
  //       <Grid md={4}>
  //         <Typography variant="h6" sx={{ mb: 0.5 }}>
  //           Properties
  //         </Typography>
  //         <Typography variant="body2" sx={{ color: "text.secondary" }}>
  //           Additional functions and attributes...
  //         </Typography>
  //       </Grid>
  //     )}

  //     <Grid xs={12} md={8}>
  //       <Card>
  //         {!mdUp && <CardHeader title="Properties" />}

  //         <Stack spacing={3} sx={{ p: 3 }}>
  //           <Stack spacing={1}>
  //             <Typography variant="subtitle2">Type</Typography>
  //             <RHFRadioGroup
  //               row
  //               spacing={4}
  //               name="type"
  //               options={CAPACITY_OPTIONS}
  //               // onChange={handleTypeChange}
  //             />
  //           </Stack>
  //         </Stack>

  //         {/* {!mdUp && <CardHeader title={values.type} />}
  //         {values.type === "Quantity" ? (
  //           <Stack spacing={3} sx={{ p: 3 }}>
  //             <RHFTextField name="quantity" label="Quantity" />
  //           </Stack>
  //         ) : (
  //           <Stack spacing={3} sx={{ p: 3 }}>
  //             <RHFTextField name="volume" label="Volume" />
  //           </Stack>
  //         )} */}
  //         {/*
  //         <Stack spacing={3} sx={{ p: 3 }}>
  //           <RHFTextField
  //             name="price"
  //             label="Price"
  //             placeholder="0.00"
  //             type="number"
  //             InputLabelProps={{ shrink: true }}
  //             InputProps={{
  //               startAdornment: (
  //                 <InputAdornment position="start">
  //                   <Box component="span" sx={{ color: "text.disabled" }}>
  //                     $
  //                   </Box>
  //                 </InputAdornment>
  //               ),
  //             }}
  //           />
  //         </Stack> */}
  //       </Card>
  //     </Grid>
  //   </>
  // );

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
              name="priceWithinState"
              label="Price With In State"
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
          </Stack>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="priceInterState"
              label="Price Inter State"
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
          </Stack>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="priceInternationl"
              label="Price International"
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
          {!currentTransportService ? "Create Service" : "Save Changes"}
        </LoadingButton>
      </Grid>
    </>
  );

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
            <RHFTextField name="name" label="Transporter Service Name" />

            <RHFTextField
              name="description"
              label="Description"
              multiline
              rows={4}
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {/* {renderProperties} */}

        {renderPricing}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
