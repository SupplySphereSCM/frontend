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
import { _tags } from "src/_mock";
// API
import { createService } from "src/api/service";
// components
import { useSnackbar } from "src/components/snackbar";
import { useRouter } from "src/routes/hooks";
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
} from "src/components/hook-form";
// types
import { IServiceItem, IServiceSchema } from "src/types/service";

import axiosInstance, { endpoints } from "src/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  currentService?: IServiceItem;
};

export default function ServiceNewEditForm({ currentService }: Props) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const NewServiceSchema = Yup.object<IServiceSchema>().shape({
    name: Yup.string().required("Name is required"),
    images: Yup.array().min(1, "Images is required"),
    price: Yup.number().moreThan(0, "Price should not be $0.00"),
    description: Yup.string().required("Description is required"),
    tax: Yup.number(),
    id: Yup.string().required("Service ID is required"),
    subDescription: Yup.string().required("Sub Description is required"),
    quantity: Yup.number().required("Quantity is required"),
    // tags: Yup.array().min(2, "Must have at least 2 tags"),
    // category: Yup.string().required("Category is required"),
    // not required
    // newLabel: Yup.object().shape({
    //   enabled: Yup.boolean(),
    //   content: Yup.string(),
    // }),
    // saleLabel: Yup.object().shape({
    //   enabled: Yup.boolean(),
    //   content: Yup.string(),
    // }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentService?.name || "",
      description: currentService?.description || "",
      subDescription: currentService?.subDescription || "",
      images: currentService?.images || [],
      price: currentService?.price || 0,
      // priceSale: currentService?.priceSale || 0,
      tax: currentService?.tax || 0,
      quantity: currentService?.quantity || 0,
      id: String(Math.random()),
      // code: currentService?.code || "",
      // sku: currentService?.sku || "",
      // tags: currentService?.tags || [],
      // gender: currentService?.gender || "",
      // category: currentService?.category || "",
      // colors: currentService?.colors || [],
      // sizes: currentService?.sizes || [],
      // newLabel: currentService?.newLabel || { enabled: false, content: "" },
      // saleLabel: currentService?.saleLabel || { enabled: false, content: "" },
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      createService(data as IServiceItem);
      reset();
      enqueueSnackbar(currentService ? "Update success!" : "Create success!");
      router.push(paths.dashboard.service.root);
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      setValue("images", [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images],
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered =
        values.images && values.images?.filter((file) => file !== inputFile);
      setValue("images", filtered);
    },
    [setValue, values.images],
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue("images", []);
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIncludeTaxes(event.target.checked);
    },
    [],
  );

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("files", values.images as any);
      await axiosInstance.post(endpoints.upload.files, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      enqueueSnackbar("Image Uploaded", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Image Upload Failed", { variant: "error" });
    }
  };

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
            <RHFTextField name="name" label="Service Name" />

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

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={handleImageUpload}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

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
  //           <Box
  //             columnGap={2}
  //             rowGap={3}
  //             display="grid"
  //             gridTemplateColumns={{
  //               xs: "repeat(1, 1fr)",
  //               md: "repeat(2, 1fr)",
  //             }}
  //           >
  //             <RHFTextField name="code" label="Service Code" />

  //             <RHFTextField name="sku" label="Service SKU" />

  //             <RHFTextField
  //               name="quantity"
  //               label="Quantity"
  //               placeholder="0"
  //               type="number"
  //               InputLabelProps={{ shrink: true }}
  //             />

  //             <RHFSelect
  //               native
  //               name="category"
  //               label="Category"
  //               InputLabelProps={{ shrink: true }}
  //             >
  //               {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
  //                 <optgroup key={category.group} label={category.group}>
  //                   {category.classify.map((classify) => (
  //                     <option key={classify} value={classify}>
  //                       {classify}
  //                     </option>
  //                   ))}
  //                 </optgroup>
  //               ))}
  //             </RHFSelect>

  //             <RHFMultiSelect
  //               checkbox
  //               name="colors"
  //               label="Colors"
  //               options={PRODUCT_COLOR_NAME_OPTIONS}
  //             />

  //             <RHFMultiSelect
  //               checkbox
  //               name="sizes"
  //               label="Sizes"
  //               options={PRODUCT_SIZE_OPTIONS}
  //             />
  //           </Box>

  //           <RHFAutocomplete
  //             name="tags"
  //             label="Tags"
  //             placeholder="+ Tags"
  //             multiple
  //             freeSolo
  //             options={_tags.map((option) => option)}
  //             getOptionLabel={(option) => option}
  //             renderOption={(props, option) => (
  //               <li {...props} key={option}>
  //                 {option}
  //               </li>
  //             )}
  //             renderTags={(selected, getTagProps) =>
  //               selected.map((option, index) => (
  //                 <Chip
  //                   {...getTagProps({ index })}
  //                   key={option}
  //                   label={option}
  //                   size="small"
  //                   color="info"
  //                   variant="soft"
  //                 />
  //               ))
  //             }
  //           />

  //           <Stack spacing={1}>
  //             <Typography variant="subtitle2">Gender</Typography>
  //             <RHFMultiCheckbox
  //               row
  //               name="gender"
  //               spacing={2}
  //               options={PRODUCT_GENDER_OPTIONS}
  //             />
  //           </Stack>

  //           <Divider sx={{ borderStyle: "dashed" }} />

  //           <Stack direction="row" alignItems="center" spacing={3}>
  //             <RHFSwitch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
  //             <RHFTextField
  //               name="saleLabel.content"
  //               label="Sale Label"
  //               fullWidth
  //               disabled={!values.saleLabel.enabled}
  //             />
  //           </Stack>

  //           <Stack direction="row" alignItems="center" spacing={3}>
  //             <RHFSwitch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
  //             <RHFTextField
  //               name="newLabel.content"
  //               label="New Label"
  //               fullWidth
  //               disabled={!values.newLabel.enabled}
  //             />
  //           </Stack>
  //         </Stack>
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
