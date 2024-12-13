export const CoreIdAddress =
  "0x98aBd7f3A7C9A24F853DdC4dF70F47A366CE0547" as const;

export const CoreIdABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "codiceFiscale",
        type: "string",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "surname",
        type: "string",
      },
      {
        internalType: "string",
        name: "birthday",
        type: "string",
      },
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
    ],
    name: "insertUserInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "getUserInfoWithPermit",
    outputs: [
      {
        internalType: "string",
        name: "username",
        type: "string",
      },
      {
        internalType: "string",
        name: "nome",
        type: "string",
      },
      {
        internalType: "string",
        name: "cognome",
        type: "string",
      },
      {
        internalType: "string",
        name: "dataNascita",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
