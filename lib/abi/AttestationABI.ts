export const attestationContract = "0x2993b368A727DB0bBf69A2fbd50eE4Bf235Bf439";

export const AttestationABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "taskId",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "schemaId",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "uHash",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "publicFieldsHash",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "validator",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "allocatorSignature",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "validatorSignature",
            type: "bytes",
          },
        ],
        internalType: "struct Proof",
        name: "_proof",
        type: "tuple",
      },
    ],
    name: "attest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "defaultAllocator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "uid",
        type: "bytes32",
      },
    ],
    name: "getAttestation",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "uid",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "schema",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "uHash",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "publicFieldsHash",
            type: "bytes32",
          },
        ],
        internalType: "struct Attestation",
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
        internalType: "address",
        name: "addr",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "b",
        type: "bytes32",
      },
    ],
    name: "recipientFromUidToSchema",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "schema",
        type: "bytes32",
      },
    ],
    name: "s_recipientFromUidToSchema",
    outputs: [
      {
        internalType: "bytes32",
        name: "uid",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "taskId",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "schemaId",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "uHash",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "publicFieldsHash",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "validator",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "allocatorSignature",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "validatorSignature",
            type: "bytes",
          },
        ],
        internalType: "struct Proof",
        name: "_proof",
        type: "tuple",
      },
    ],
    name: "verify",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_taskId",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_schemaId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_validator",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_allocatorSignature",
        type: "bytes",
      },
    ],
    name: "verifyAllocatorSignature",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_taskId",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_schemaId",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_uHash",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_publicFieldsHash",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_validator",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_validatorSignature",
        type: "bytes",
      },
    ],
    name: "verifyValidatorSignature",
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
] as const;
