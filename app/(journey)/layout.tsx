import { cookies } from "next/headers";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";
import { auth } from "../(auth)/auth";
import Script from "next/script";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get("sidebar:state")?.value !== "true";

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <BreadcrumbProvider>
        <SidebarProvider
          defaultOpen={false}
          className="relative z-10 h-screen w-full overflow-hidden"
        >
          <AppSidebar user={session?.user} />
          <SidebarInset className="!bg-transparent size-full overflow-y-auto overflow-x-hidden">
            {children}
          </SidebarInset>
        </SidebarProvider>
      </BreadcrumbProvider>
    </>
  );
}
