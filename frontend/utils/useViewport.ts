"use client";
import { useState, useEffect } from "react";

export type ViewportSize = "mobile" | "tablet" | "desktop";

export function useViewport(): ViewportSize | null {
  const [viewport, setViewport] = useState<ViewportSize | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setViewport("mobile");
      } else if (width < 1024) {
        setViewport("tablet");
      } else {
        setViewport("desktop");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return viewport;
}
