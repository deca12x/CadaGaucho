"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2, ChevronLeft, ChevronRight, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { usePrivy } from "@privy-io/react-auth";
import { Petition } from "@/lib/supabase/types";
import { hasUserIdentity, shortenAddress } from "@/lib/utils";
import { VotesChart } from "../../components/ui/petition-radial-chart";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";

export default function PetitionList() {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [hasIdentity, setHasIdentity] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signLoading, setSignLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPetition, setSelectedPetition] = useState<Petition | null>(
    null
  );
  const [showUserPetitions, setShowUserPetitions] = useState(false);
  const [hasVoted, setHasVoted] = useState(false); // New state for vote status
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  const itemsPerPage = 15;

  // Function to check if the user has voted.
  const checkHasVoted = async (
    address: string | undefined,
    petitionId: string
  ) => {
    const { data, error } = await supabase
      .from("vote")
      .select("*")
      .eq("signer", address || "")
      .eq("petiton", petitionId);
    if (error) {
      console.error("Error fetching votes:", error);
      return false;
    } else {
      console.log("Votes:", data);
      return data?.length > 0;
    }
  };

  const fetchPetitions = useCallback(async () => {
    if (!authenticated) return;

    setLoading(true);
    let query = supabase.from("petition").select("*", { count: "exact" });

    if (showUserPetitions && user?.wallet?.address) {
      query = query.eq("creator", user.wallet.address.toString());
    }

    const { data, error, count } = await query.range(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage - 1
    );

    if (error) {
      console.error("Error fetching petitions:", error);
    } else {
      setPetitions(data || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    }
    setLoading(false);
  }, [
    currentPage,
    itemsPerPage,
    showUserPetitions,
    authenticated,
    user?.wallet?.address,
  ]);

  useEffect(() => {
    if (authenticated) {
      const checkIdentity = async () => {
        if (user && user.wallet?.address) {
          const identity = await hasUserIdentity(user.wallet.address);
          setHasIdentity(identity);
        }
      };
      fetchPetitions();
      checkIdentity();
    }
  }, [authenticated, currentPage, fetchPetitions, showUserPetitions, user]);

  const handleSignAnonymously = async () => {
    setSignLoading(true);

    if (!user || !user.wallet?.address) {
      console.error("User address is not available.");
      setSignLoading(false);
      return;
    }

    try {
      const args = {
        petitionId: selectedPetition?.id,
        voter: user.wallet.address,
      };
      const res = await fetch("/api/vote", {
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
        throw new Error(`Failed to write petition onchain: ${error}`);
      }
    } catch (error: any) {
      console.log(error.message);
      setSignLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("vote").insert([
        {
          signer: user.wallet.address,
          permit: false,
          petiton: selectedPetition?.id,
        },
      ]);

      if (error) {
        console.error("Error inserting data:", error);
        throw new Error("Failed to insert data into the database");
      }

      const { data: data2, error: error2 } = await supabase
        .from("petition")
        .update({
          votes: (selectedPetition?.votes || 0) + 1,
        })
        .eq("id", selectedPetition?.id);

      if (error2) {
        throw new Error("Failed to insert data into the database");
      } else {
        console.log("Data inserted successfully:", data);
        console.log("Data updated successfully:", data2);
        setSignLoading(false);
        setSuccess(true);
        router.push("/petitions");
      }
    } catch (error) {
      setSignLoading(false);
      console.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    const fetchVoteStatus = async () => {
      if (selectedPetition && user?.wallet?.address) {
        const voted = await checkHasVoted(
          user.wallet.address,
          selectedPetition.id.toString()
        );
        setHasVoted(voted);
      }
    };
    fetchVoteStatus();
  }, [selectedPetition, user]);

  if (!ready || loading) {
    return (
      <motion.div
        className="flex justify-center items-center h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Loader2 className="w-12 h-12 text-[#8b4513] animate-spin" />
      </motion.div>
    );
  }

  if (!authenticated) {
    router.push("/");
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.5,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        yoyo: Infinity,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#f0e7d8] p-4 my-16">
      {hasIdentity ? (
        <motion.div
          className="min-h-screen bg-[#f0e7d8] p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="max-w-6xl mx-auto bg-[#d3c7a2] rounded-lg shadow-2xl overflow-hidden"
            style={{
              backgroundImage: "url('/background/paper-texture-2.jpg')",
              backgroundBlendMode: "multiply",
            }}
            variants={tableVariants}
          >
            <div className="p-6">
              <h1 className="text-3xl font-bold text-center text-[#4a2c0f] mb-6">
                {showUserPetitions ? "My Petitions" : "Active Petitions"}
              </h1>
              <div className="flex justify-end mb-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="user-petitions"
                    checked={showUserPetitions}
                    onCheckedChange={setShowUserPetitions}
                  />
                  <Label htmlFor="user-petitions">Show only my petitions</Label>
                </div>
              </div>
              {loading ? (
                <motion.div
                  className="flex justify-center items-center h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader2 className="w-12 h-12 text-[#8b4513] animate-spin" />
                </motion.div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-[#4a2c0f] text-xl">
                        Name
                      </TableHead>
                      <TableHead className="text-[#4a2c0f] text-xl">
                        Creator
                      </TableHead>
                      <TableHead className="text-[#4a2c0f] text-xl">
                        End Date
                      </TableHead>
                      <TableHead className="text-[#4a2c0f] text-xl">
                        Signatures Goal
                      </TableHead>
                      <TableHead className="text-[#4a2c0f] text-xl">
                        Current Signatures
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {petitions.map((petition) => (
                      <TableRow
                        key={petition.id}
                        onClick={() => setSelectedPetition(petition)}
                        className="cursor-pointer hover:bg-[rgba(229,231,235,0.5)]"
                      >
                        <TableCell className="text-[#5e3a1a] text-md">
                          {petition.name}
                        </TableCell>
                        <TableCell className="text-[#5e3a1a] text-md">
                          {shortenAddress(petition.creator)}
                        </TableCell>
                        <TableCell className="text-[#5e3a1a] text-md">
                          {new Date(petition.enddate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-[#5e3a1a] text-md">
                          {petition.goal}
                        </TableCell>
                        <TableCell className="text-[#5e3a1a] text-md">
                          {petition.votes || 0}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            <div className="flex justify-between items-center py-2 px-4 bg-[#8b4513] text-[#f0e7d8]">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="ghost"
                className="text-[#f0e7d8] hover:text-[#d3c7a2]"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                variant="ghost"
                className="text-[#f0e7d8] hover:text-[#d3c7a2]"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          <AnimatePresence>
            {selectedPetition && (
              <Dialog
                open={!!selectedPetition}
                onOpenChange={() => setSelectedPetition(null)}
              >
                <DialogContent
                  className="bg-transparent text-[#4a2c0f] max-w-4xl p-0 border-none"
                  style={{
                    backgroundImage: "url('/background/paper-texture-2.jpg')",
                    backgroundBlendMode: "multiply",
                  }}
                >
                  <DialogHeader className="p-6">
                    <DialogTitle>{selectedPetition.name}</DialogTitle>
                  </DialogHeader>
                  <div className="flex p-6 pt-0">
                    <div className="flex-grow grid gap-4 pr-6">
                      <p>
                        <strong>Creator:</strong> {selectedPetition.creator}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedPetition.description}
                      </p>
                      <p>
                        <strong>Extended Description:</strong>{" "}
                        {selectedPetition.extendeddescription}
                      </p>
                      <p>
                        <strong>End Date:</strong>{" "}
                        {new Date(
                          selectedPetition.enddate
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Signatures Goal:</strong>{" "}
                        {selectedPetition.goal}
                      </p>
                      <p>
                        <strong>Current Signatures:</strong>{" "}
                        {selectedPetition.votes || 0}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-[250px]">
                      <VotesChart
                        chartData={[
                          {
                            browser: "safari",
                            signers: selectedPetition.votes ?? 0,
                            fill: "hsl(var(--chart-2))",
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <DialogFooter className="p-6">
                    {selectedPetition.creator ===
                    user?.wallet?.address ? null : (
                      <div>
                        {hasVoted ? (
                          <div className="text-green-500">
                            You have already signed this petition. Thanks!
                          </div>
                        ) : signLoading ? (
                          <LoadingSpinner />
                        ) : !signLoading && success ? (
                          <div className="text-green-500">
                            Successfully signed!
                          </div>
                        ) : (
                          <div className="flex justify-center items-center gap-3">
                            <Button
                              onClick={handleSignAnonymously}
                              className="bg-[#8b4513] hover:bg-[#6e3710] text-[#f0e7d8]"
                            >
                              Sign Anonymously
                            </Button>
                            <Button
                              onClick={handleSignAnonymously}
                              className="bg-[#5e3a1a] hover:bg-[#4a2c0f] text-[#f0e7d8]"
                            >
                              Sign as Doxxed
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          className="relative w-full max-w-2xl p-12 bg-[#d3c7a2] rounded-lg shadow-2xl overflow-hidden"
          style={{
            backgroundImage: "url('/background/paper-texture-2.jpg')",
            backgroundBlendMode: "multiply",
          }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-2 bg-[#8b4513]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-full h-2 bg-[#8b4513]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          />
          <div className="flex flex-col justify-center items-center gap-8">
            <motion.div
              className="flex flex-col justify-center items-center gap-4"
              variants={titleVariants}
            >
              <h1 className="text-3xl font-bold text-center text-[#4a2c0f] leading-tight">
                Create your onchain identity
              </h1>
              <User className="w-12 h-12 text-[#8b4513]" />
              <p className="text-lg text-center text-[#5e3a1a]">
                Before creating or signing petitions, you need to create an
                onchain identity. Click the button below, follow the
                instructions, and come back here.
              </p>
            </motion.div>
            <motion.button
              className="flex items-center justify-center bg-[#8b4513] hover:bg-[#6e3710] py-3 px-10 text-[#f0e7d8] rounded-lg text-lg font-semibold shadow-md"
              onClick={() => {
                router.push("/verify");
              }}
              variants={buttonVariants}
              whileHover="hover"
            >
              Create Identity
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
