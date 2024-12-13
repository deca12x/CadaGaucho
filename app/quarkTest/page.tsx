"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuarkIDTest() {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // States for QuarkID operations
  const [didDocument, setDidDocument] = useState<any>(null);
  const [identityStatus, setIdentityStatus] = useState<
    "none" | "creating" | "created"
  >("none");

  useEffect(() => {
    // Check if user has a DID when component mounts
    const checkExistingDID = async () => {
      if (user?.wallet?.address) {
        try {
          // TODO: Implement API call to check if user has existing DID
          // setIdentityStatus based on response
        } catch (error) {
          console.error("Error checking DID:", error);
        }
      }
    };

    checkExistingDID();
  }, [user]);

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

  const handleCreateIdentity = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to create new DID
      setIdentityStatus("creating");
    } catch (error) {
      console.error("Error creating identity:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIdentity = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to update DID
    } catch (error) {
      console.error("Error updating identity:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveIdentity = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to resolve DID
    } catch (error) {
      console.error("Error resolving identity:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateIdentity = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to deactivate DID
    } catch (error) {
      console.error("Error deactivating identity:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 my-14">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          QuarkID Integration Test
        </h1>

        <div className="space-y-4">
          <Button
            onClick={handleCreateIdentity}
            className="w-full"
            disabled={loading || identityStatus === "created"}
          >
            Create Identity
          </Button>

          <Button
            onClick={handleUpdateIdentity}
            className="w-full"
            disabled={loading || identityStatus !== "created"}
          >
            Update Identity
          </Button>

          <Button
            onClick={handleResolveIdentity}
            className="w-full"
            disabled={loading}
          >
            Resolve Identity
          </Button>

          <Button
            onClick={handleDeactivateIdentity}
            className="w-full"
            disabled={loading || identityStatus !== "created"}
          >
            Deactivate Identity
          </Button>

          {didDocument && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h2 className="text-xl font-semibold mb-2">DID Document:</h2>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(didDocument, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
