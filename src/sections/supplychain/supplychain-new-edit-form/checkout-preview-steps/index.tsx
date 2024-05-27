// @mui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
//components
import Iconify from "src/components/iconify";
import { useSnackbar } from "src/components/snackbar";
import SupplychainStepsTable from "../checkout-configure-steps/step-card";
import FormProvider from "src/components/hook-form";
//hooks
import { useCheckoutContext } from "../context";
import {
  createSupplyChain,
  updateSupplyChain,
  // useGetToUser,
} from "src/api/supplychain";
// types
import {
  IStepInput,
  ISupply,
  ISupplyChainSchema,
  ISupplyChainStepItem,
  ISupplyChainStepLabel,
  IvalueItem,
  StepType,
} from "src/types/supplychain";
// form
import { useFieldArray, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// wagmi
import { parseUnits } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "src/web3/wagmi.config";
import {
  SupplyChainABI,
  addresses as supplyChainAddress,
} from "src/abi/supplychain";
import { INRABI, addresses as inrAddresses } from "src/abi/inr";
import { addresses as supplysphereAddresses } from "src/abi/supplysphere";
import { getStorage } from "src/hooks/use-local-storage";
import { IServiceItem, ITransporterServiceItem } from "src/types/service";
import { IRawMaterialItem } from "src/types/raw-materials";
import { simulateContract } from "@wagmi/core";
import { readContract } from "@wagmi/core";
import { useState } from "react";
import {} from "../index";

const STORAGE_KEY = "checkout";

const stepTypeMap: Record<StepType, number> = {
  PROCURING: 0,
  SERVICING: 1,
};

type Props = {
  // handleFormSubmit: any;
  handleSupplychainId: (id: string) => void;
};

export default function CheckoutPreviewSteps({
  handleSupplychainId, // handleFormSubmit,
}: Props) {
  const { chainId } = useAccount();

  const { enqueueSnackbar } = useSnackbar();

  const { writeContractAsync } = useWriteContract();

  const [fundChain, setFundChain] = useState(false);

  const { onReset, onBackStep } = useCheckoutContext();

  const { watch } = useFormContext<ISupplyChainSchema>();

  const steps = watch("steps");
  const data = watch();
  // console.log("Data from watch:", data);
  const { handleSubmit } = useFormContext();
  const { materials, services, logistics } = getStorage(
    STORAGE_KEY
  ) as IvalueItem;

  console.log("logistics:", logistics);

  const handleReset = () => {
    onReset();
  };

  var totalSupplyChainAmount = 0;
  // console.log("steps:", steps);

  steps.map((step) => {
    totalSupplyChainAmount += (step as ISupply).totalStepAmount;
  });

  const handleCreateSupplyChain = async (data: ISupplyChainSchema) => {
    var totalFundedAmount;
    try {
      if (data?.id) {
        await updateSupplyChain(data);
      } else {
        // Clone the steps array to avoid modifying the original data
        // console.log("Data steps:", data.steps);
        console.log("Data:", data);

        const smartContractSteps: IStepInput[] = data.steps.map((step) => {
          // ...step,
          const logistic = logistics.find(
            (item: ITransporterServiceItem) => item.id === step.transport.value
          );

          let receiver: IRawMaterialItem | IServiceItem;
          if (step.rawMaterial !== null) {
            receiver = materials.find(
              (item) => item.id === step.rawMaterial.value
            ) as IRawMaterialItem;
          } else {
            receiver = services.find(
              (item) => item.id === step.service.value
            ) as IServiceItem;
          }
          console.log("receiver: ", receiver);

          // step.stepType = stepTypeMap[step.stepType];
          return {
            stepType: stepTypeMap[step.stepType],
            itemId: BigInt(receiver.eid),
            logisticsId: BigInt(logistic!.eid),
            quantity: BigInt(step.quantity!),
            receiver: receiver.user.ethAddress as `0x${string}`,
          };
        });

        const backendSteps = data.steps as ISupply[];
        console.log("smartcontract steps:", smartContractSteps);
        // try {
        const { result } = await simulateContract(config, {
          abi: SupplyChainABI,
          address: supplyChainAddress[`${chainId}`] as `0x${string}`,
          functionName: "createSupplyChain",
          args: [data.name, data.description, smartContractSteps],
        });
        console.log("result:", result);
        // } catch (error) {
        //   console.error(error);
        // }
        // console.log("result:", result);

        const supplychainEid = result;
        console.log("supplychainEid:", supplychainEid);

        handleSupplychainId(String(supplychainEid));

        // ----------------------------------------------------------------------

        const hash = await writeContractAsync({
          abi: SupplyChainABI,
          address: supplyChainAddress[`${chainId}`] as `0x${string}`,
          functionName: "createSupplyChain",

          args: [data.name, data.description, smartContractSteps],
        });
        const { transactionHash } = await waitForTransactionReceipt(config, {
          hash,
        });

        // ----------------------------------------------------------------------

        // Read Contract for supplychain object
        // const stepResult = await readContract(config, {
        //   abi: SupplyChainABI,
        //   address: supplyChainAddress[`${chainId}`] as `0x${string}`,
        //   functionName: "getSupplyChain",
        //   args: [supplychainEid],
        // });

        // const stepsObject = stepResult?.steps;

        // // ----------------------------------------------------------------------

        // for (let i = 0; i < backendSteps.length; i++) {
        //   backendSteps[i].eid = String(stepsObject[i].stepId);
        // }

        // data.steps = backendSteps;

        // data.eid = String(supplychainEid);
        // data.transactionHash = String(transactionHash);
        // console.log("DATA:", data);
        enqueueSnackbar("Supply chain Created successfully!", {
          variant: "success",
        });
        // await createSupplyChain(data);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Supply chain Creation un-successfully!", {
        variant: "error",
      });
    }
  };

  const handleApproveINR = async () => {
    try {
      const hash = await writeContractAsync({
        abi: INRABI,
        address: inrAddresses[`${chainId}`] as `0x${string}`,
        functionName: "approve",
        args: [
          supplysphereAddresses[`${chainId}`] as `0x${string}`,
          parseUnits(String(totalSupplyChainAmount), 2),
        ],
      });
      await waitForTransactionReceipt(config, {
        hash,
      });
      setFundChain(true);
      enqueueSnackbar("Approve successfully!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Approve un-successfully!", { variant: "error" });
      console.error(error);
    }
  };

  // const handelSubmitFun = async (data) => {
  //   console.log("DATA:", data);
  // };
  // const handleSubmit = () => {
  //   console.log("DATA:", data);
  // };
  return (
    <>
      <Typography>Preview the Form</Typography>
      <Grid xs={12} md={6} lg={8}>
        <SupplychainStepsTable
          title="Supplychain Steps"
          tableData={steps}
          tableLabels={[
            { id: "from", label: "From" },
            { id: "to", label: "To" },
            { id: "transport", label: "Transporter", align: "center" },
            { id: "particulars", label: "particulars", align: "right" },
            { id: "stepType", label: "Step Type", align: "right" },
          ]}
        />
      </Grid>
      <Stack
        spacing={2}
        alignItems="flex-end"
        sx={{ my: 3, textAlign: "right", typography: "body2" }}
      >
        <Stack direction="row" sx={{ typography: "subtitle1", mr: 3 }}>
          <Box>Total Amount</Box>
          <Box sx={{ width: 160 }}>$ {totalSupplyChainAmount}</Box>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-around"
        spacing={2}
        sx={{ mt: 3 }}
      >
        <Button
          color="primary"
          onClick={() => handleCreateSupplyChain(data)}
          variant="contained"
          size="large"
        >
          Create Supply chain
        </Button>
        <Button
          color="primary"
          onClick={handleApproveINR}
          variant="contained"
          size="large"
        >
          Approve
        </Button>
        <Button
          disabled={!fundChain}
          color="primary"
          type="submit"
          // onClick={handleSubmit(handelSubmitFun)}
          variant="contained"
          size="large"
        >
          Fund Chain
        </Button>
      </Stack>
      <Stack direction="row" justifyContent="space-between" mt={3}>
        <Button
          size="small"
          color="inherit"
          onClick={onBackStep}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Back
        </Button>
        <Button
          size="large"
          color="warning"
          variant="contained"
          startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
          onClick={handleReset}
          sx={{ whiteSpace: "nowrap" }}
        >
          Reset
        </Button>
      </Stack>
    </>
  );
}
