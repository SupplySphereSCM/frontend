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

  const memoizedValue = useMemo(
    () => ({
      ...state,
      completed,
      onBackStep,
      onNextStep,
      onGotoStep,
      //
      onReset,
    }),
    [
      state,
      completed,
      onBackStep,
      onGotoStep,
      onNextStep,
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
