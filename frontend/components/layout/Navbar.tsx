"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="bg-background border-b border-border px-6 h-[60px] flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <span className="text-lg">✦</span>
        <span className="font-bold text-base text-foreground">
          Glorified Todo
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden sm:inline-block">
          user@example.com
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/auth")}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
