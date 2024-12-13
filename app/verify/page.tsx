"use client";

import { verify } from "@/lib/zkpass";
import { useAccount, useWriteContract } from "wagmi";
import { ethers } from "ethers";
import { mockedData } from "@/lib/constants";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const { authenticated, ready, user } = usePrivy();
  const [error, setError] = useState("");
  const [finished, setFinished] = useState(false);
  const account = useAccount();
  const router = useRouter();
  const [glitchText, setGlitchText] = useState("VERIFY");

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let newText = "";
      for (let i = 0; i < 6; i++) {
        newText += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setGlitchText(newText);
    }, 100);

    setTimeout(() => {
      clearInterval(glitchInterval);
      setGlitchText("VERIFY");
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleVerify = async () => {
    // Verify
    const { response, message } = await verify(
      process.env.NEXT_PUBLIC_APP_ID!,
      process.env.NEXT_PUBLIC_SCHEMA_ID!,
      account.address
    );

    // If the response is null, show an alert with the message
    if (!response && user?.wallet?.address) {
      console.log("Transgate response failed");
      try {
        const hexTaskId = ethers.hexlify(
          ethers.toUtf8Bytes(mockedData.taskId)
        ) as `0x${string}`;
        const hexSchemaId = ethers.hexlify(
          ethers.toUtf8Bytes(process.env.NEXT_PUBLIC_SCHEMA_ID!)
        ) as `0x${string}`;

        const args = {
          taskId: hexTaskId,
          schemaId: hexSchemaId,
          uHash: mockedData.uHash as `0x${string}`,
          recipient: user.wallet.address as `0x${string}`,
          publicFieldsHash: mockedData.publicFieldsHash as `0x${string}`,
          validator: mockedData.validatorAddress as `0x${string}`,
          allocatorSignature: mockedData.allocatorSignature as `0x${string}`,
          validatorSignature: mockedData.validatorSignature as `0x${string}`,
          publicFields: mockedData.publicFields,
          embeddedAddress: account.address,
        };

        try {
          const res = await fetch("/api/send-cyphertext", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: args,
            }),
          });

          if (!res.ok) {
            const error = await res.text();
            throw new Error(`Failed to send ciphertext: ${error}`);
          }
          setFinished(true);
        } catch (error: any) {
          console.log(error.message);
          setError("An error occurred while creating your identity.");
        }
      } catch (err: any) {
        alert(JSON.stringify(err));
        console.log("error: ", err.message);
        setError("An error occurred while creating your identity.");
      }
      return;
    }

    // Log the response and, if the mintToken checkbox is checked, mint a token
    console.log("Transgate response: ", response);
    if (response && response.recipient) {
      try {
        const hexTaskId = ethers.hexlify(
          ethers.toUtf8Bytes(response.taskId)
        ) as `0x${string}`;
        const hexSchemaId = ethers.hexlify(
          ethers.toUtf8Bytes(process.env.NEXT_PUBLIC_SCHEMA_ID!)
        ) as `0x${string}`;
        const args = {
          taskId: hexTaskId,
          schemaId: hexSchemaId,
          uHash: response.uHash,
          recipient: response.recipient,
          publicFieldsHash: response.publicFieldsHash,
          validator: response.validatorAddress,
          allocatorSignature: response.allocatorSignature,
          validatorSignature: response.validatorSignature,
          publicFields: response.publicFields,
          embeddedAddress: account.address,
        };

        try {
          const res = await fetch("/api/send-cyphertext", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: args,
            }),
          });

          if (!res.ok) {
            const error = await res.text();
            throw new Error(`Failed to send ciphertext: ${error}`);
          }
          setFinished(true);
        } catch (error: any) {
          console.log(error.message);
          setError("An error occurred while creating your identity.");
        }
      } catch (err: any) {
        setError("An error occurred while creating your identity.");
        console.log("error: ", err);
      }
    }
  };

  if (ready && !authenticated) {
    router.push("/");
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-20 font-mono bg-black text-green-400">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMyMjIiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-10"></div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col z-10 justify-center items-center gap-2"
      >
        <h1 className="text-6xl font-bold mb-4 text-center text-green-500 glitch-text">
          CREATE YOUR ONCHAIN ID
        </h1>
        <p className="text-sm text-center max-w-2xl">
          A cutting-edge application designed to rigorously test and validate
          your identity through a verification processes that uses TransGate
          extension and zkPass SDK.
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-36 h-36 my-6"
      >
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>
        <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-24 h-24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
      </motion.div>

      {!ready ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
        </motion.div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${
              !account.address
                ? "bg-gray-800 cursor-not-allowed"
                : finished
                ? "bg-yellow-500 hover:bg-yellow-400"
                : "bg-green-500 hover:bg-green-400"
            } px-8 py-3 text-black rounded-md font-bold text-lg relative overflow-hidden`}
            onClick={
              finished
                ? () => {
                    router.push("/petitions");
                  }
                : handleVerify
            }
            disabled={!account.address}
          >
            <span className="relative z-10">
              {finished ? "Go back" : glitchText}
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-full h-full ${
                  finished ? "bg-yellow-300" : "bg-green-300"
                } animate-pulse opacity-75`}
              ></div>
            </div>
          </motion.button>

          {error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-red-500"
            >
              {error}
            </motion.div>
          ) : !error && finished ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-green-500"
            >
              Successfully verified!
            </motion.div>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 text-sm opacity-75 max-w-md text-center"
          >
            <p>
              Note: Your identity will be minted encrypted on the Fhenix
              blockchain right after the verification process is completed.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
