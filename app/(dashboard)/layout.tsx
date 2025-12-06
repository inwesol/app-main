import { cookies } from "next/headers";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/aceternity-sidebar";
import { auth } from "../(auth)/auth";
import Script from "next/script";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session] = await Promise.all([auth(), cookies()]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          <AppSidebar user={session?.user} />
          <main
            className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300"
            style={{ marginLeft: "var(--sidebar-width, 64px)" }}
          >
            {children}
          </main>
        </div>
      </SidebarProvider>
    </>
  );
}
