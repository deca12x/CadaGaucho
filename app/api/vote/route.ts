import { NextRequest, NextResponse } from "next/server";
import { JsonRpcProvider, Wallet, Contract } from "ethers";
import {
  PetitionManagerABI,
  PetitionManagerContract,
} from "@/lib/abi/PetitionManagerABI";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { petitionId, voter } = body.data;

  if (!petitionId || !voter) {
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

    const contract = new Contract(
      PetitionManagerContract,
      PetitionManagerABI,
      signer
    );

    console.log("Writing vote...");

    const tx = await contract.vote(petitionId, voter);
    console.log("Vote signed!");
    // Wait for the transaction to be mined
    await tx.wait();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.log("Error: ", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
