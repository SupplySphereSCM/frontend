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
import { CheckoutContextProps } from "src/types/supplychain";
import { IServiceItem } from "src/types/service";

// ----------------------------------------------------------------------

const STORAGE_KEY = "checkout";

const initialState = {
  activeStep: 0,
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

  const completed = state.activeStep === STEPS.length;

  // Reset
  const onReset = useCallback(() => {
    if (completed) {
      reset();
      router.replace(paths.product.root);
    }
  }, [completed, reset, router]);

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
      const updatedItems: ICheckoutItem[] = state.services.map(
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
