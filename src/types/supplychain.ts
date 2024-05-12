import { IRawMaterialItem } from "./raw-materials";
import { IServiceItem } from "./service";

export type ISupplyChainItem = {
  id: string;
  name: string;
  description: string;
  steps: ISupplyChainStepItem[];

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
  steps: ISupplyChainStepItem[];
};

export type CheckoutContextProps = {
  activeStep: number;
  completed: boolean;
  //
  onAddToCart: (newItem: Omit<ISupplyChainItem, "subTotal">) => void;
  onDeleteCart: (itemId: string) => void;
  //
  onIncreaseQuantity: (itemId: string) => void;
  onDecreaseQuantity: (itemId: string) => void;
  onBackStep: VoidFunction;
  onNextStep: VoidFunction;
  onGotoStep: (step: number) => void;
  //
  onAddMaterial: (material: IRawMaterialItem) => void;
  onAddService: (service: IServiceItem) => void;
  onAddLogistics: (logistics: any) => void;
  //
  canReset: boolean;
  onReset: VoidFunction;
};

// type typeField = {
//   label: string;
//   value: string;
// };

// export type ISupplyChainStepItem = {
//   from: typeField;
//   to: typeField;
//   stepType: string;
//   transport: typeField;
//   service: typeField;
//   rawMaterial: typeField;
//   product: typeField;
// };

export type ISupplyChainStepItem = {
  from: string;
  to: string;
  stepType: string;
  transport: string;
  service: string;
  rawMaterial: string;
  product: string;
  quantity: number;
};

export type ISupplyChainStepLabel = {
  from: string;
  to: string;
  stepType: string;
  transport: string;
  service: string;
  rawMaterial: string;
  product: string;
  quantity: number;
};
