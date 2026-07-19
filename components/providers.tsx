"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { makeQueryClient } from "@/lib/query-client";
import { AppBootstrap } from "@/components/app-bootstrap";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AppBootstrap />
      {children}
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "!bg-card !text-foreground !border-white/10",
          },
        }}
      />
    </QueryClientProvider>
  );
}
