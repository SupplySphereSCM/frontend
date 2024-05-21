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
import { NewSupplyChainSchema } from "..";
import {
  createSupplyChain,
  updateSupplyChain,
  // useGetToUser,
} from "src/api/supplychain";
// types
import {
  ISupplyChainSchema,
  ISupplyChainStepItem,
  ISupplyChainStepLabel,
} from "src/types/supplychain";
// form
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// wagmi
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
import { IServiceItem } from "src/types/service";
import { IRawMaterialItem } from "src/types/raw-materials";
import { simulateContract } from "@wagmi/core";
import { readContract } from "@wagmi/core";
import { useState } from "react";

const STORAGE_KEY = "checkout";

const stepTypeMap = {
  PROCURING: 0,
  SERVICING: 1,
};

type Props = {
  handleSupplychainId: (id: string) => void;
};

export default function CheckoutPreviewSteps({ handleSupplychainId }: Props) {
  const { onReset, onBackStep } = useCheckoutContext();
  const { watch, control, handleSubmit } = useFormContext<ISupplyChainSchema>();
  const { enqueueSnackbar } = useSnackbar();
  const { writeContractAsync } = useWriteContract();
  const { chainId } = useAccount();
  const [funcdChain, setFundChain] = useState(false);
  const stepArray = watch("stepArray");
  // console.log("stepArray:", stepArray);

  // var totalFundedAmount = 0;

  const value = getStorage(STORAGE_KEY);
  // console.log("value", value);

  if (value !== null) {
    var { materials, services, logistics } = value;
  }

  const handleReset = () => {
    console.log("clicked");
    onReset();
  };

  let totalSupplyChainAmount = 0;
  stepArray?.map((step) => {
    totalSupplyChainAmount += step?.totalStepAmount;
  });

  console.log("totalFunded amount:", totalSupplyChainAmount);

  // const { append } = useFieldArray({
  //   control,
  //   name: "steps",
  // });

  const handleCreateSupplyChain = handleSubmit(async (data) => {
    console.log("DATA:", data);
    var totalFundedAmount;
    try {
      if (data?.id) {
        await updateSupplyChain(data);
      } else {
        // Clone the steps array to avoid modifying the original data
        // console.log("Data steps:", data.steps);

        const smartContractSteps = data.steps.map((step) => ({
          ...step,
          itemId: 0n,
          logisticsId: 0n,
          receiver: "",
          // quantity: 0n,
        }));

        const backendSteps = data.steps;

        console.log("smartContractSteps:", smartContractSteps);

        // Map stepType values to be compatible with the smart contract
        const smartContractStepType: any = smartContractSteps.map((step) => {
          // StepType
          step.stepType = stepTypeMap[step.stepType];
          // Logistic ID
          const logistic = logistics.find(
            (item) => item.id === step?.transport
          );
          // totalFundedAmount += logistic?.priceWithinState;
          step.logisticsId = BigInt(logistic?.eid);

          // Item Id
          // step.quantity = (step.quantity);
          if (step.rawMaterial !== null) {
            var receiver = materials.find(
              (item) => item.id === step?.rawMaterial
            );
            step.itemId = BigInt(receiver?.eid);

            // console.log("Receiver:", receiver);
            // console.log("rawmaterial:", step.rawMaterial.replace(/-/g, ""));

            // step.itemId = BigInt(step.rawMaterial.replace(/-/g, ""));
            // step.itemId = BigInt(`0x${step.rawMaterial.replace(/-/g, "")}`);
          } else {
            var receiver = services.find((item) => item.id === step.service);
            step.itemId = BigInt(receiver?.eid);
            // step.itemId = BigInt(step.service.replace(/-/g, ""));
            // step.itemId = BigInt(`0x${step.service.replace(/-/g, "")}`);
          }

          // Receiver ETH Address
          step.receiver = receiver?.user?.ethAddress;

          delete step.product;
          delete step.service;
          delete step.rawMaterial;
          delete step.to;
          delete step.from;
          delete step.transport;
          return step;
        });

        console.log("smartContractStepType", smartContractStepType);
        // console.log("Data to be sent to contract:", {
        //   name: data.name,
        //   description: data.description,
        //   steps: smartContractStepType,
        // });

        // console.log("Data", data);

        const { result } = await simulateContract(config, {
          abi: SupplyChainABI,
          address: supplyChainAddress[`${chainId}`] as `0x${string}`,
          functionName: "createSupplyChain",
          args: [data.name, data.description, smartContractStepType],
        });
        const supplychainEid = result;
        handleSupplychainId(supplychainEid);
        console.log("Supplychain eid:", supplychainEid);

        // ----------------------------------------------------------------------

        const hash = await writeContractAsync({
          abi: SupplyChainABI,
          address: supplyChainAddress[`${chainId}`] as `0x${string}`,
          functionName: "createSupplyChain",

          args: [data.name, data.description, smartContractStepType],
        });
        const { transactionHash } = await waitForTransactionReceipt(config, {
          hash,
        });

        // ----------------------------------------------------------------------

        // Read Contract for supplychain object
        const stepResult = await readContract(config, {
          abi: SupplyChainABI,
          address: supplyChainAddress[`${chainId}`] as `0x${string}`,
          functionName: "getSupplyChain",
          args: [supplychainEid],
        });
        console.log("Get Supplychain Result:", stepResult);

        const stepsObject = stepResult?.steps;
        // totalFundedAmount = stepsObject?.totalFundedAmount;

        // console.log("StepObject: ", stepsObject);
        // supplyChainID = supplychainEid;

        // ----------------------------------------------------------------------

        for (let i = 0; i < backendSteps.length; i++) {
          backendSteps[i].eid = String(stepsObject[i].stepId);
        }
        data.steps = backendSteps;

        // // Include hash and transactionHash in the data object
        data.eid = String(supplychainEid);
        data.transactionHash = String(transactionHash);
        console.log("DATA:", data);

        await createSupplyChain(data);
      }
    } catch (error) {
      console.error(error);
    }
  });

  const handleApproveINR = async () => {
    // console.log("Approve INR");

    const hash = await writeContractAsync({
      abi: INRABI,
      address: inrAddresses[`${chainId}`] as `0x${string}`,
      functionName: "approve",
      args: [
        supplysphereAddresses[`${chainId}`] as `0x${string}`,
        BigInt(totalSupplyChainAmount),
      ],
    });
    const { transactionHash } = await waitForTransactionReceipt(config, {
      hash,
    });
    setFundChain(true);
    console.log("transactionHash", transactionHash);
  };

  return (
    <>
      <Typography>Preview the Form</Typography>
      <Grid xs={12} md={6} lg={8}>
        <SupplychainStepsTable
          title="Supplychain Steps"
          tableData={stepArray as ISupplyChainStepLabel[]}
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
          onClick={handleCreateSupplyChain}
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
          disabled={!funcdChain}
          color="primary"
          type="submit"
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
