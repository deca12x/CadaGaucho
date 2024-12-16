"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EXTRIMIAN_CONFIG,
  isExtrimianConfigValid,
} from "@/lib/extrimian/config";
import { ExtrimianAPI } from "@/lib/extrimian/api";
import { QRCodeSVG } from "qrcode.react";

// Define the verification flow states
type VerificationStep =
  | "initial" // Initial state
  | "requestingVC" // Requesting Verifiable Credential
  | "displayingQR" // QR code is displayed
  | "awaitingScan" // Waiting for user to scan QR
  | "verifying" // Verifying with Extrimian
  | "verified" // Verification complete
  | "failed"; // Verification failed

interface VerificationState {
  step: VerificationStep;
  error?: string;
  invitationId?: string;
  oobContentData?: string;
  verifierDID?: string;
}

export default function QuarkIDTest() {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Main verification state
  const [verificationState, setVerificationState] = useState<VerificationState>(
    {
      step: "initial",
    }
  );

  const [configValid, setConfigValid] = useState(false);

  // Effect to check if user is already verified
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!user?.wallet?.address) return;

      try {
        // TODO: Check if user's DID is already verified
        // This will be implemented when we add Extrimian API integration
      } catch (error) {
        console.error("Error checking verification status:", error);
      }
    };

    checkVerificationStatus();
  }, [user]);

  // Effect to check configuration
  useEffect(() => {
    // Check configuration
    setConfigValid(isExtrimianConfigValid());
  }, []);

  // Loading state
  if (!ready) {
    return (
      <motion.div
        className="flex justify-center items-center h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Loader2 className="w-12 h-12 animate-spin" />
      </motion.div>
    );
  }

  // Authentication check
  if (!authenticated) {
    router.push("/");
    return null;
  }

  // Handler to start verification process
  const handleStartVerification = async () => {
    setLoading(true);
    setVerificationState({ step: "requestingVC" });

    try {
      // Use our stored DID directly
      const response = await ExtrimianAPI.requestPresentation(
        EXTRIMIAN_CONFIG.developerDid!
      );
      console.log(
        "Full Presentation Response:",
        JSON.stringify(response, null, 2)
      );
      console.log("oobContentData:", response.oobContentData);
      console.log("invitationId:", response.invitationId);

      setVerificationState({
        step: "displayingQR",
        invitationId: response.invitationId,
        oobContentData: response.oobContentData,
        verifierDID: EXTRIMIAN_CONFIG.developerDid,
      });
    } catch (error) {
      console.error("Error requesting presentation:", error);
      setVerificationState({
        step: "failed",
        error: "Failed to request credential verification",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 my-14">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          QuarkID Verification
        </h1>

        <div className="space-y-4">
          {/* Config Status */}
          <div className="text-center mb-4">
            <p
              className={`text-lg ${
                configValid ? "text-green-600" : "text-red-600"
              }`}
            >
              Configuration: {configValid ? "Valid" : "Invalid"}
            </p>
          </div>

          {/* Status display */}
          <div className="text-center mb-4">
            <p className="text-lg">Current Status: {verificationState.step}</p>
            {verificationState.error && (
              <p className="text-red-500">{verificationState.error}</p>
            )}
          </div>

          {/* Action button */}
          <Button
            onClick={handleStartVerification}
            className="w-full"
            disabled={
              loading || verificationState.step !== "initial" || !configValid
            }
          >
            Start Verification
          </Button>

          {/* Add a test button */}
          <Button
            onClick={async () => {
              try {
                const response = await ExtrimianAPI.createDID();
                console.log("DID Creation Response:", response);
              } catch (error) {
                console.error("DID Creation Failed:", error);
              }
            }}
            className="w-full mt-4"
          >
            Test DID Creation
          </Button>

          {/* TODO: Add QR code display area */}
          {verificationState.step === "displayingQR" &&
            verificationState.oobContentData && (
              <div className="mt-8 flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4">
                  Scan with QuarkID App
                </h2>
                <div className="bg-white p-4 rounded-lg">
                  <QRCodeSVG
                    value={verificationState.oobContentData}
                    size={256}
                    level="H"
                    includeMargin
                  />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
