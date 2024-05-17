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
import {} from "@wagmi/core";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "src/web3/wagmi.config";

import {
  SupplyChainABI,
  addresses as supplyChainAddress,
} from "src/abi/supplychain";
import { IFaucetItem } from "src/types/faucet";

// ----------------------------------------------------------------------

type Props = {
  currentProduct?: IProductItem;
};

export default function FaucetNewEditForm() {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const { writeContractAsync } = useWriteContract();
  const { chainId } = useAccount();

  const NewProductSchema = Yup.object<IFaucetItem>().shape({
    address: Yup.string().required("Eth address is required"),
    amount: Yup.number().required("amount is required"),
  });

  const defaultValues = useMemo(
    () => ({
      address: "",
      amount: 0,
    }),
    []
  );

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
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const hash = await writeContractAsync({
        abi: SupplyChainABI,
        address: supplyChainAddress[`${chainId}`] as `0x${string}`,
        functionName: "mint",
        args: [address, amount],
      });
      const { transactionHash } = await waitForTransactionReceipt(config, {
        hash,
      });

      reset();
      enqueueSnackbar("Faucet added success", { variant: "success" });
      router.push(paths.dashboard.product.root);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Faucet added un-success", {
        variant: "error",
      });
    }
  });

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
            <RHFTextField name="address" label="Eth address" />
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
          {!mdUp && <CardHeader title="Amount" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="amount"
              label="Amount"
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
        <Box flex={1} />

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          Add Faucet
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
