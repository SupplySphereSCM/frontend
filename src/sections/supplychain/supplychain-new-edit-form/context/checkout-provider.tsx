import { useEffect, useMemo, useCallback } from "react";
// hooks
import { useLocalStorage, getStorage } from "src/hooks/use-local-storage";
// routes
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
// types
import { IAddressItem } from "src/types/address";
import { ICheckoutItem } from "src/types/checkout";
//
import { CheckoutContext } from "./checkout-context";
import { STEPS } from "..";
import { IRawMaterialItem } from "src/types/raw-materials";
import { CheckoutContextProps, ISupplyChainItem } from "src/types/supplychain";
import { IServiceItem } from "src/types/service";
import { useCall } from "wagmi";

// ----------------------------------------------------------------------

const STORAGE_KEY = "checkout";

const initialState = {
  activeStep: 0,
  materials: [],
  services: [],
  logistics: [],
};

type Props = {
  children: React.ReactNode;
};

export function CheckoutProvider({ children }: Props) {
  const router = useRouter();

  const { state, update, reset } = useLocalStorage(STORAGE_KEY, initialState);

  const onBackStep = useCallback(() => {
    update("activeStep", state.activeStep - 1);
  }, [update, state.activeStep]);

  const onNextStep = useCallback(() => {
    update("activeStep", state.activeStep + 1);
  }, [update, state.activeStep]);

  const onGotoStep = useCallback(
    (step: number) => {
      update("activeStep", step);
    },
    [update],
  );

  // console.log("Steps length", STEPS.length);
  // console.log("Active step", state.activeStep);

  // const completed = state.activeStep === STEPS.length;
  const completed = true;
  // Reset
  const onReset = useCallback(() => {
    // console.log(completed);

    if (completed) {
      reset();
      router.replace(paths.dashboard.product.root);
    }
  }, [completed, reset, router]);

  const onAddSupplychainSteps = useCallback(
    (newStep: ICheckoutItem) => {
      const UpdatedSteps: ICheckoutItem[] = state.steps.map(
        (supplychain: ICheckoutItem) => {
          if (supplychain.id == newStep.id) {
            return {
              ...supplychain,
              quantity: supplychain.quantity + 1,
            };
          }
          return supplychain;
        },
      );
      if (
        !UpdatedSteps.some(
          (supplyChain: ICheckoutItem) => supplyChain.id === newStep.id,
        )
      ) {
        UpdatedSteps.push(newStep);
      }

      update("steps", UpdatedSteps);
    },
    [update, state.steps],
  );

  const onAddMaterial = useCallback(
    (newItem: ICheckoutItem) => {
      const updatedItems: ICheckoutItem[] = state.materials.map(
        (item: ICheckoutItem) => {
          if (item.id === newItem.id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        },
      );

      if (!updatedItems.some((item: ICheckoutItem) => item.id === newItem.id)) {
        updatedItems.push(newItem);
      }

      update("materials", updatedItems);
    },
    [update, state.materials],
  );

  const onAddService = useCallback(
    (newItem: ICheckoutItem) => {
      const updatedItems: ICheckoutItem[] = state.services?.map(
        (item: ICheckoutItem) => {
          if (item.id === newItem.id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        },
      );

      if (!updatedItems.some((item: ICheckoutItem) => item.id === newItem.id)) {
        updatedItems.push(newItem);
      }

      update("services", updatedItems);
    },
    [update, state.services],
  );

  const onAddLogistics = useCallback(
    (newItem: ICheckoutItem) => {
      const updatedItems: ICheckoutItem[] = state.logistics.map(
        (item: ICheckoutItem) => {
          if (item.id === newItem.id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        },
      );

      if (!updatedItems.some((item: ICheckoutItem) => item.id === newItem.id)) {
        updatedItems.push(newItem);
      }

      update("logistics", updatedItems);
    },
    [update, state.logistics],
  );

  const memoizedValue = useMemo(
    () =>
      ({
        ...state,
        completed,
        onBackStep,
        onNextStep,
        onGotoStep,
        //
        onAddService,
        onAddMaterial,
        onAddLogistics,
        //
        onReset,
      }) as CheckoutContextProps,
    [
      state,
      completed,
      onBackStep,
      onGotoStep,
      onNextStep,
      //
      onAddService,
      onAddMaterial,
      onAddLogistics,
      //
      onReset,
    ],
  );

  return (
    <CheckoutContext.Provider value={memoizedValue}>
      {children}
    </CheckoutContext.Provider>
  );
}
