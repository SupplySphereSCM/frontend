import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useMemo, useEffect, useState } from "react";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Unstable_Grid2";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
// routes
import { paths } from "src/routes/paths";
// hooks
import { useResponsive } from "src/hooks/use-responsive";
// API
import {
  createProduct,
  createRawMaterial,
  updateProduct,
  updateRawMaterial,
} from "src/api/product";
// components
import { useSnackbar } from "src/components/snackbar";
import { useRouter } from "src/routes/hooks";
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
} from "src/components/hook-form";
// types
import { IProductItem, IProductSchema } from "src/types/product";
// utils
import axiosInstance, { endpoints } from "src/utils/axios";
import { useAuthContext } from "src/auth/hooks";
import { IRawMaterialItem } from "src/types/raw-materials";
// wagmi
// import { toUint256 } from "@wagmi/core";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "src/web3/wagmi.config";
import product from "src/abi/Products.json";
import productsABI from "src/abi/product.abi";
import rawMaterial from "src/abi/RawMaterials.json";
import rawMaterialsABI from "src/abi/raw-material.abi";
// ----------------------------------------------------------------------

type Props = {
  currentProduct?: IProductItem;
};

export default function ProductNewEditForm({ currentProduct }: Props) {
  const router = useRouter();

  const { user } = useAuthContext();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const { writeContractAsync } = useWriteContract();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const [images, setImages] = useState<string[]>([]);

  const NewProductSchema = Yup.object<IProductSchema>().shape({
    id: Yup.string(),

    name: Yup.string().required("Name is required"),
    subDescription: Yup.string().required("Sub Description is required"),
    description: Yup.string().required("Description is required"),
    images: Yup.array().min(1, "Images is required"),

    code: Yup.string().required("Product code is required"),
    quantity: Yup.number().required("Quantity is required"),
    price: Yup.number().moreThan(0, "Price should not be $0.00"),
    tax: Yup.number(),
    transactionHash: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentProduct?.id,
      name: currentProduct?.name || "",
      subDescription: currentProduct?.subDescription || "",
      description: currentProduct?.description || "",
      images: currentProduct?.images || [],
      code: currentProduct?.code || "",
      quantity: currentProduct?.quantity || 0,
      transactionHash: currentProduct?.transactionHash || Date.now().toString(),
      price: currentProduct?.price || 0,
      tax: currentProduct?.tax || 0,
    }),
    [currentProduct]
  );

  console.log("product-new-edit-form: defaultValues ", defaultValues);

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
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
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue("tax", 0);
    } else {
      setValue("tax", currentProduct?.tax || 0);
    }
  }, [currentProduct?.tax, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!data.images) {
        data.images = images;
      }

      if (user?.roles.includes("SELLER")) {
        if (currentProduct?.id) {
          // Update ?
          await updateRawMaterial(data as IRawMaterialItem);
        } else {
          // const hash = await writeContractAsync({
          //   abi: rawMaterialsABI,
          //   address: rawMaterial?.address as `0x${string}`,
          //   functionName: "addRawMaterial",
          //   args: [
          //     data.name,
          //     toUint256(data.price),
          //     toUint256(data.tax),
          //     toUint256(data.quantity),
          //   ],
          //   // args: [data?.name, BigInt(data?.price), data?.tax, data?.quantity],
          //   // @ts-ignore
          // });
          // const { transactionHash } = await waitForTransactionReceipt(config, {
          //   hash,
          // });
          // data.eid = hash;
          // data.transactionHash = transactionHash;
          await createRawMaterial(data as IRawMaterialItem);
          // enqueueSnackbar("Raw Material Created successfully", {
          //   variant: "success",
          // });
        }
      } else if (user?.roles.includes("MANUFACTURER")) {
        if (currentProduct?.id) {
          await updateProduct(data as IProductItem);
        } else {
          // const hash = await writeContractAsync({
          //   abi: productsABI,
          //   address: product.address as `0x${string}`,
          //   functionName: "addProduct",
          //   // @ts-ignore
          //   args: [   data.name,
          //   toUint256(data.price),
          //   toUint256(data.tax),
          //   toUint256(data.quantity),
          // ],
          // });
          // const { transactionHash } = await waitForTransactionReceipt(config, {
          //   hash,
          // });
          // // Include hash and transactionHash in the data object
          // data.eid = hash;
          // data.transactionHash = transactionHash;
          await createProduct(data as IProductItem);
          // enqueueSnackbar("Product Created successfully", {
          //   variant: "success",
          // });
        }
      }

      reset();
      enqueueSnackbar(currentProduct ? "Update success!" : "Create success!");
      router.push(paths.dashboard.product.root);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Product Creation un-successfully", {
        variant: "error",
      });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue("images", [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered =
        values.images && values.images?.filter((file) => file !== inputFile);
      setValue("images", filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue("images", []);
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIncludeTaxes(event.target.checked);
    },
    []
  );

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      if (Array.isArray(values.images)) {
        values.images.forEach((file) => {
          formData.append("files", file);
        });
      } else {
        formData.append("files", values.images as any);
      }

      const results = await axiosInstance.post(
        endpoints.upload.files,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(results);

      setImages(results.data);
      enqueueSnackbar("Image Uploaded", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        `Image Upload Failed: ${
          error.response ? error.response.data.message : error.message
        }`,
        { variant: "error" }
      );
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
            <RHFTextField name="name" label="Product Name" />

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
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
              }}
            >
              <RHFTextField name="code" label="Product Code" />

              <RHFTextField
                name="quantity"
                label="Quantity"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Stack>
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
        <Box flex={1} />

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentProduct ? "Create Product" : "Save Changes"}
        </LoadingButton>
      </Grid>
    </>
  );

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
