import { IRawMaterialItem } from "./raw-materials";
import { IServiceItem, ITransporterServiceItem } from "./service";

export type ISupplyChainItem = {
  id?: string;
  eid?: string;
  name: string;
  description: string;
  steps: ISupplyChainStepItem[];
  // transactionHash: string;
  // createdAt: Date;
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
  eid?: string;
  name: string;
  description: string;
  steps: ISupplyChainStepItem[];
  transactionHash?: string;
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

export type IvalueItem = {
  activeStep: number;
  billing: any | null; // Adjust as necessary
  discount: number;
  items: any[]; // Adjust as necessary
  logistics: ITransporterServiceItem[];
  materials: IRawMaterialItem[];
  services: IServiceItem[];
  shipping: number;
  subTotal: number;
  total: number;
  totalItems: number;
};

type IStepObj = {
  label: string;
  value: string;
};

export type ISupplyChainStepItem = {
  from: IStepObj;
  to: IStepObj;
  stepType: StepType;
  transport: IStepObj;
  service: IStepObj;
  rawMaterial: IStepObj;
  product: IStepObj;
};

export type ISupply = ISupplyChainStepItem & {
  eid?: string;
  quantity: number;
  totalStepAmount: number;
};

export enum StepType {
  PROCURING = "PROCURING",
  SERVICING = "SERVICING",
}
export type IStepInput = {
  stepType: number;
  itemId: bigint;
  logisticsId: bigint;
  quantity: bigint;
  receiver: `0x${string}`;

  //---------------
  // transport: string;
  // rawMaterial: string;
  // service: string;
};

export type ISupplyChainStepLabel = {
  eid: string;
  from: string;
  to: string;
  stepType: string;
  transport: string;
  service: string;
  rawMaterial: string;
  product: string;
  quantity: number;
  totalStepAmount: number;
};
