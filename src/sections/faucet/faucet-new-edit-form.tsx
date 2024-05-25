import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect } from "react";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
// hooks
import { useResponsive } from "src/hooks/use-responsive";
// API
// components
import { useSnackbar } from "src/components/snackbar";
import FormProvider, { RHFTextField } from "src/components/hook-form";
// types
import { IProductItem } from "src/types/product";
// utils
// wagmi
import { parseUnits } from "viem";
import { useAccount, useBalance, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "src/web3/wagmi.config";

import { IFaucetItem } from "src/types/faucet";

import { INRABI, addresses as inrAddresses } from "src/abi/inr";

// ----------------------------------------------------------------------

type Props = {
  currentProduct?: IProductItem;
};

export default function FaucetNewEditForm() {
  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const { writeContractAsync } = useWriteContract();
  const { address, chainId } = useAccount();

  const { data } = useBalance({
    address,
    token: inrAddresses[`${chainId}`] as `0x${string}`,
  });

  console.log(data);

  // const { value } = data ? (data as { value: bigint }) : 0;
  const value = data ? (data as { value: bigint }).value : 0n;

  const NewProductSchema = Yup.object<IFaucetItem>().shape({
    address: Yup.string().required("Eth address is required"),
    amount: Yup.number().required("amount is required"),
  });

  const defaultValues = useMemo(
    () => ({
      address: address as string,
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const hash = await writeContractAsync({
        abi: INRABI,
        address: inrAddresses[`${chainId}`] as `0x${string}`,
        functionName: "mint",
        args: [
          data.address as `0x${string}`,
          parseUnits(String(data.amount), 18),
        ],
        // BigInt(data.amount * 100)],
      });
      await waitForTransactionReceipt(config, {
        hash,
      });

      reset();
      enqueueSnackbar("Money send Successfully", { variant: "success" });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Mint Failed", {
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
            Enter Address...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={2} sx={{ p: 3 }}>
            <RHFTextField name="address" label="Eth address" />
            <Typography variant="caption">
              Balance: {value.toString()}
            </Typography>
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
            Amount
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Enter Amount to Mint
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
