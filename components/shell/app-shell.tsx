import { BottomNav } from "@/components/shell/bottom-nav";
import { Fab } from "@/components/shell/fab";
import { PageTransition } from "@/components/shell/page-transition";
import { GlobalDialogs } from "@/components/global-dialogs";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-svh w-full max-w-2xl flex-1 flex-col">
      <main
        className="flex-1 px-4"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 1.75rem)",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 104px)",
        }}
      >
        <PageTransition>{children}</PageTransition>
      </main>
      <Fab />
      <BottomNav />
      <GlobalDialogs />
    </div>
  );
}
