"use client";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();

  const hasIdentity = true; // TODO: Check if the user has an identity onchain

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!authenticated) {
    router.push("/");
    return null; // Prevent rendering the rest of the component
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      {!hasIdentity ? <div>You need to verify yourself first</div> : <div>Sign petition page</div>}
    </div>
  );
}
