import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { defineChain } from "viem";

export const fhenix = defineChain({
  id: 8008135,
  name: "Fhenix Helium",
  nativeCurrency: { name: "Fhenix Tokens", symbol: "tFHE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://api.helium.fhenix.zone"] },
  },
  blockExplorers: {
    default: { name: "Fhenix Explorer", url: "https://explorer.helium.fhenix.zone" },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [fhenix],
  transports: {
    [fhenix.id]: http(),
  },
});
