export type ISupplyChainItem = {
  id: string;
  name: string;
  description: string;

  createdAt: Date;
};

export type ISupplyChainFilterValue = {};

export type ISupplyChainFilters = {};

export const SUPPLYCHAIN_SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "oldest", label: "Oldest" },
];

export type ISupplyChainSchema = {
  id?: string;
  name: string;
  description: string;
};

export type CheckoutContextProps = {
  activeStep: number;
  completed: boolean;
  //
  onBackStep: VoidFunction;
  onNextStep: VoidFunction;
  onGotoStep: (step: number) => void;
  canReset: boolean;
  onReset: VoidFunction;
};

export type ISupplyChainStepItem = {};
