// Contract to check if the user has an attestation of identity onchain

// The zkPass allocator address
export const allocatorAddress = "0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d"; // TODO: change this with the correct address

// This is useful in case zkPass won't work during the demo
export const mockedData = {
  allocatorAddress: "0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d",
  allocatorSignature:
    "0x8478ef1344da1ea886325df25ceab5d189d919fbdcd5a6a0648b50b4d42913456fd35de24237190fc2c682d8caffbb9cc3dc7d19898f8cc8db0311e9c888ea471b",
  publicFields: [
    {
      data: {
        content: {
          nome: "Matteo",
          cognome: "Rossi",
          username: "MTORSS77C15H501Z",
          dataNascita: "1977-10-05",
        },
      },
    },
  ],
  publicFieldsHash:
    "0x42b440a4cfba2b82385dc8c470fec652b7b717fcc82d8bda51c8af86a0468177",
  taskId: "a3555ce1ad334614bd9849c7a2ceb84c",
  uHash: "0x6a7b79e79a88a7302e4c1fbb1e8dae52c2a7663a132c809609435a728d2221ba",
  validatorAddress: "0xb1C4C1E1Cdd5Cf69E27A3A08C8f51145c2E12C6a",
  validatorSignature:
    "0x573903f348acff227aa4b910dfd264985813083d1294bc0a97b49c6e28b36a882cc64a54ffac9d092fe52971857e1d689d8f723ee81f020ae47d0511667e1a691c",
};
