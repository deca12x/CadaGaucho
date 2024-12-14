import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { AttestationABI, attestationContract } from "./abi/AttestationABI";
import { ethers } from "ethers";
import { supabase } from "@/lib/supabase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenAddress = (address?: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const hasUserIdentity = async (address: string): Promise<boolean> => {
  const hexSchemaId = ethers.hexlify(
    ethers.toUtf8Bytes(process.env.NEXT_PUBLIC_SCHEMA_ID!)
  ) as `0x${string}`;

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  try {
    const data = await publicClient.readContract({
      address: attestationContract,
      abi: AttestationABI,
      functionName: "recipientFromUidToSchema",
      args: [address as `0x${string}`, hexSchemaId],
    });

    if (
      data ===
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      return false;
    }
    return true;
  } catch (err: any) {
    console.log("Error:", err.message);
    return false;
  }
};

export async function checkWalletVerification(
  walletAddress: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_verifications")
    .select("is_verified")
    .eq("wallet_address", walletAddress)
    .single();

  if (error) {
    console.error("Error checking verification:", error);
    return false;
  }

  return data?.is_verified || false;
}

export async function markWalletAsVerified(
  walletAddress: string,
  did?: string
) {
  const { error } = await supabase.from("user_verifications").upsert({
    wallet_address: walletAddress,
    is_verified: true,
    did: did,
    verified_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error marking wallet as verified:", error);
    throw error;
  }
}
