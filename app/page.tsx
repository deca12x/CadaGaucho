"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Feather } from "lucide-react";

export default function Home() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push("/create");
    }
  }, [authenticated, router]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
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

  if (!ready) {
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

  if (authenticated) {
    return null;
  }

  return (
    <div className="flex flex-col h-full items-center justify-start pt-10 my-20 bg-[#f0e7d8]">
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
            <h1 className="text-4xl font-bold text-center text-[#4a2c0f] leading-tight">
              Vox Populi, Vox Dei
            </h1>
            <p className="text-sm text-center text-[#5e3a1a]">
              the voice of the people (is) the voice of God
            </p>
            <Feather className="w-12 h-12 text-[#8b4513]" />
            <p className="text-lg text-center text-[#5e3a1a]">
              Welcome to Vox, a private, secure and sybil-resistant petition
              platform
            </p>
          </motion.div>
          <motion.button
            className="flex items-center justify-center bg-[#8b4513] hover:bg-[#6e3710] py-3 px-10 text-[#f0e7d8] rounded-lg text-lg font-semibold shadow-md"
            onClick={login}
            variants={buttonVariants}
            whileHover="hover"
          >
            Log in
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
