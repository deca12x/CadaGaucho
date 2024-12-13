"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Clipboard, Feather } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { shortenAddress } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const { authenticated, user, logout } = usePrivy();
  const router = useRouter();
  const pathname = usePathname();
  const noNavbarRoutes = ["/verify"];

  if (noNavbarRoutes.includes(pathname)) {
    return <div></div>;
  }

  const navbarVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const linkVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        yoyo: Infinity,
      },
    },
  };

  return (
    <motion.nav
      className="border-b border-[#8b4513] bg-[#d3c7a2] shadow-md fixed top-0 left-0 w-full z-50"
      style={{
        backgroundImage: "url('/background/paper-texture-2.jpg')",
        backgroundBlendMode: "multiply",
      }}
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex-shrink-0">
            <motion.span
              className="text-3xl font-bold text-[#4a2c0f] flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Feather className="w-8 h-8 mr-2" />
              Vox
            </motion.span>
          </Link>
          <div className="hidden md:block ml-10">
            <div className="flex items-baseline space-x-9">
              <motion.div variants={linkVariants} whileHover="hover">
                <Link
                  href="/petitions"
                  className="text-lg font-medium text-[#5e3a1a] hover:text-[#8b4513] transition-colors duration-200"
                >
                  Petitions
                </Link>
              </motion.div>
              <motion.div variants={linkVariants} whileHover="hover">
                <Link
                  href="/create"
                  className="text-lg font-medium text-[#5e3a1a] hover:text-[#8b4513] transition-colors duration-200"
                >
                  New petition
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
        {authenticated && (
          <div>
            <div className="hidden md:block">
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-12 w-12 rounded-full border-2 border-[#8b4513] hover:bg-[#c4b17e] transition-colors duration-200"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          className="bg-yellow-100"
                          src="/avatars/feather.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-[#f0e7d8] border-2 border-[#8b4513]"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-[#4a2c0f]">
                          Address
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs leading-none text-[#5e3a1a]">
                            {shortenAddress(user?.wallet?.address)}
                          </p>
                          <button
                            onClick={async () => {
                              await navigator.clipboard.writeText(
                                user?.wallet?.address ?? ""
                              );
                            }}
                            className="text-[#8b4513] hover:text-[#6e3710] transition-colors duration-200"
                          >
                            <Clipboard height={16} />
                          </button>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Button
                        onClick={async () => {
                          await logout();
                          router.push("/");
                        }}
                        className="w-full bg-[#8b4513] hover:bg-[#6e3710] text-[#f0e7d8] transition-colors duration-200"
                      >
                        Log out
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-[#8b4513] hover:bg-[#c4b17e] transition-colors duration-200"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open main menu</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
