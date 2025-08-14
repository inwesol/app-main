import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import Script from "next/script";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.inwesol.com"),
  title: "CoCo - AI Mindset Coach",
  description: "AI Mindset Coach from Inwesol.",
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile
};

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const LIGHT_THEME_COLOR = "hsl(0 0% 100%)";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isCollapsed = cookieStore.get("sidebar:state")?.value !== "true";

  // Get current pathname to determine sidebar layout
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";

  // Determine if we're on a chat page that needs double sidebar
  const isChatPage = pathname === "/" || pathname.startsWith("/chat");
  const needsDoubleSidebar = isChatPage;

  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <meta name="theme-color" content={LIGHT_THEME_COLOR} />
      </head>
      <body className="antialiased min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50">
        <Script
          src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
          strategy="beforeInteractive"
        />
        <Toaster position="top-center" />
        <SidebarProvider
          defaultOpen={true}
          className="relative z-10 h-screen w-full overflow-hidden"
        >
          <AppSidebar user={null} />
          <SidebarInset
            className={`
              !bg-transparent size-full overflow-y-auto overflow-x-hidden
              ${
                needsDoubleSidebar
                  ? "[--sidebar-width:calc(var(--sidebar-width-icon)+2px+280px)]" // Adjust for double sidebar
                  : "[--sidebar-width:calc(var(--sidebar-width-icon)+2px)]" // Single sidebar width
              }
            `}
          >
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
