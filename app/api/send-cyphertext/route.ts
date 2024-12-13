import { NextRequest, NextResponse } from "next/server";
import { JsonRpcProvider, Wallet, Contract } from "ethers";
import {
  AttestationABI,
  attestationContract,
} from "../../../lib/abi/AttestationABI";
import { CoreIdABI, CoreIdAddress } from "../../../lib/abi/CoreIdABI";
import {
  FhenixClient,
  SupportedProvider,
  EncryptionTypes,
  EncryptedUint256,
} from "fhenixjs";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const {
    taskId,
    schemaId,
    uHash,
    recipient,
    publicFieldsHash,
    validator,
    allocatorSignature,
    validatorSignature,
    publicFields,
  } = body.data;

  if (
    !taskId ||
    !schemaId ||
    !uHash ||
    !recipient ||
    !publicFieldsHash ||
    !validator ||
    !allocatorSignature ||
    !validatorSignature ||
    !publicFields
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Set up the provider with JsonRpcApiProvider
    const provider = new JsonRpcProvider("https://rpc2.sepolia.org");

    // Set up the signer using the private key
    const signer = new Wallet(process.env.PRIVATE_KEY!, provider);

    const abi = AttestationABI;
    const contract = new Contract(attestationContract, abi, signer);

    console.log("attesting...");

    // Interact with the contract
    const args = {
      taskId,
      schemaId,
      uHash,
      recipient,
      publicFieldsHash,
      validator,
      allocatorSignature,
      validatorSignature,
    };

    const tx = await contract.attest(args);
    console.log("attested!");
    // Wait for the transaction to be mined
    await tx.wait();
  } catch (error: any) {
    console.log("Error: ", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    // Set up the provider with JsonRpcApiProvider
    const provider = new JsonRpcProvider("https://rpc2.sepolia.org");

    // Set up the signer using the private key
    const signer = new Wallet(process.env.PRIVATE_KEY!, provider);

    const abi = CoreIdABI;
    const contract = new Contract(CoreIdAddress, abi, signer);

    console.log("writing data onchain...");

    const tx = await contract.insertUserInfo(
      publicFields[0]?.data.content.username ?? "MTTRSS92C92H501Z",
      publicFields[0]?.data.content.nome ?? "Matteo",
      publicFields[0]?.data.content.cognome ?? "Rossi",
      publicFields[0]?.data.content.dataNascita ?? "1992-03-03",
      recipient
    );

    console.log("Wrote!");

    return NextResponse.json(
      {
        message: "User info inserted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error: ", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // NOTE: The following code was meant to write the user's information to the blockchain
  // But unfortunately, the Fhenix blockchain wasn't working and the local blockchain wasn't collaborating
  // Even using fhenixjs 0.3.0 didn't do the trick

  // try {
  //   const fhenixProvider = new JsonRpcProvider(
  //     "https://api.helium.fhenix.zone"
  //   );

  //   // initialize Fhenix Client
  //   const client = new FhenixClient({
  //     provider: fhenixProvider as SupportedProvider,
  //   });

  //   const signer = new Wallet(process.env.PRIVATE_KEY!, fhenixProvider);

  //   const abi = CoreIdABI;
  //   const contract = new Contract(CoreIdAddress, abi, signer);

  //   // ---- Step 1: Read value from contract using stringToUint ----
  //   const inputStrings = [
  //     publicFields[0]?.data.content.nome ?? "Matteo",
  //     publicFields[0]?.data.content.cognome ?? "Rossi",
  //     publicFields[0]?.data.content.username ?? "MTTRSS92C92H501Z",
  //     publicFields[0]?.data.content.dataNascita ?? "1992-03-03",
  //   ];

  //   // Call the contract's stringsToUintArray function to convert all at once
  //   const uintArray = await contract.stringsToUintArray(inputStrings);

  //   // Extract individual uint256 values from the returned array
  //   const nameUintValue = uintArray[0];
  //   const surnameUintValue = uintArray[1];
  //   const usernameUintValue = uintArray[2];
  //   const dataNascitaUintValue = uintArray[3];

  //   // ---- Step 2: Encrypt each value using the Fhenix client ----
  //   const castedName: EncryptedUint256 = await client.encrypt(
  //     nameUintValue,
  //     EncryptionTypes.uint256
  //   );
  //   const castedSurname: EncryptedUint256 = await client.encrypt(
  //     surnameUintValue,
  //     EncryptionTypes.uint256
  //   );
  //   const castedUsername: EncryptedUint256 = await client.encrypt(
  //     usernameUintValue,
  //     EncryptionTypes.uint256
  //   );
  //   const castedDataNascita: EncryptedUint256 = await client.encrypt(
  //     dataNascitaUintValue,
  //     EncryptionTypes.uint256
  //   );
  //   console.log(castedName, castedSurname, castedUsername, castedDataNascita);

  //   // ---- Step 3: Send the encrypted values to the contract ----
  //   const tx = await contract.insertUserInfo(
  //     castedName, // encrypted name
  //     castedSurname, // encrypted surname
  //     castedUsername, // encrypted username
  //     castedDataNascita, // encrypted birthday
  //     embeddedAddress as `0x${string}`
  //   );

  //   // Wait for the transaction to be mined
  //   const receipt = await tx.wait();

  //   return NextResponse.json({
  //     success: true,
  //     txHash: receipt.transactionHash,
  //     message: "User info inserted successfully",
  //   });
  // } catch (error: any) {
  //   console.error("Transaction error:", error);
  //   return NextResponse.json({ error: error.message }, { status: 500 });
  // }
};
