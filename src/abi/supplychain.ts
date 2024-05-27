export const SupplyChainABI = [
  {
    inputs: [
      {
        internalType: "contract Logistics",
        name: "_logistics",
        type: "address",
      },
      {
        internalType: "contract RawMaterials",
        name: "_rawMaterials",
        type: "address",
      },
      {
        internalType: "contract Services",
        name: "_services",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "supplyChainId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stepId",
        type: "uint256",
      },
    ],
    name: "_confirmReceiver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "supplyChainId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stepId",
        type: "uint256",
      },
    ],
    name: "_confirmSender",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "supplyChainId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stepId",
        type: "uint256",
      },
    ],
    name: "_confirmTransporterDelivered",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "supplyChainId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stepId",
        type: "uint256",
      },
    ],
    name: "_confirmTransporterReceived",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "stepId",
            type: "uint256",
          },
          {
            internalType: "enum SupplyChain.StepType",
            name: "stepType",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "itemId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "logisticsId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "quantity",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "logisticsCost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "itemCost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalCost",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "address",
            name: "transporter",
            type: "address",
          },
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
          {
            internalType: "bool",
            name: "senderConfirmed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "transporterReceived",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "transporterDelivered",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "receiverConfirmed",
            type: "bool",
          },
        ],
        internalType: "struct SupplyChain.Step",
        name: "step",
        type: "tuple",
      },
    ],
    name: "_isStepCompleted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
    ],
    name: "_setFundChain",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "chainIdCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        components: [
          {
            internalType: "enum SupplyChain.StepType",
            name: "stepType",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "itemId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "logisticsId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "quantity",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
        ],
        internalType: "struct SupplyChain.StepInput[]",
        name: "_steps",
        type: "tuple[]",
      },
    ],
    name: "createSupplyChain",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "getSupplyChain",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "stepId",
                type: "uint256",
              },
              {
                internalType: "enum SupplyChain.StepType",
                name: "stepType",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "itemId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "logisticsId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "quantity",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "logisticsCost",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "itemCost",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "totalCost",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "sender",
                type: "address",
              },
              {
                internalType: "address",
                name: "transporter",
                type: "address",
              },
              {
                internalType: "address",
                name: "receiver",
                type: "address",
              },
              {
                internalType: "bool",
                name: "senderConfirmed",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "transporterReceived",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "transporterDelivered",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "receiverConfirmed",
                type: "bool",
              },
            ],
            internalType: "struct SupplyChain.Step[]",
            name: "steps",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "totalFundedAmount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isFunded",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
        ],
        internalType: "struct SupplyChain.Chain",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "supplychains",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "totalFundedAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isFunded",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const addresses: Record<string, string> = {
  "1337": "0xa6C898E7FeD4Ee140B1260a87d20dE6058D392e4",
  "80002": "0x60f9B3a89487d7C93c6dff7C707f3044E9c83c66",
};
