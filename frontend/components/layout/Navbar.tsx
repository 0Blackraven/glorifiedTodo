"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

export default function Navbar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <div className=" border-e-6 py-6 w-[18%] h-fill flex flex-col justify-between sticky left-0 z-10 px-6 ">
      <div className="flex items-center gap-3">
        <span className="text-5xl text-amber-900">✦</span>
        <span className="font-bold text-2xl text-foreground">
          Glorified Todo
        </span>
      </div>
      
      {children}

      <div className="flex gap-4 justify-end">
        <Button
          onClick={() => router.push("/auth")}
          className= "w-15 h-9 cursor-pointer bg-amber-50"
        >
          <Power className= "text-black"/>
        </Button>
      </div>
    </div>
  );
}
