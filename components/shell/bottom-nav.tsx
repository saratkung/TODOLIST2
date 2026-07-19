"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "@/constants/nav";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 safe-bottom">
      <div className="mx-auto max-w-xl px-3 pb-3">
        <div className="glass flex items-center justify-between rounded-[24px] px-1.5 py-1.5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.06]">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-[10px] font-medium transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 rounded-2xl bg-primary/15"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon
                  className={cn(
                    "relative size-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
                <span
                  className={cn(
                    "relative transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
