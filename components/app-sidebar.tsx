"use client";

import * as React from "react";
import type { User } from "next-auth";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Route,
  MapIcon,
  Sparkles,
  HistoryIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  type Links,
  useSidebarContext,
} from "@/components/ui/aceternity-sidebar";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { ChatHistorySheet } from "@/components/chat-history-sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlusIcon } from "./icons";

// Navigation data
const navMain = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Explorer",
    url: "https://www.inwesol.com/explorer/",
    icon: MapIcon,
  },
  {
    title: "CoCo",
    url: "/chat",
    icon: Sparkles,
  },
  {
    title: "Journey",
    url: "/journey",
    icon: Route,
  },
];

function SidebarHeaderText({ isMobile }: { isMobile: boolean }) {
  const { open, isHovered } = useSidebarContext();
  const shouldShow = open || isHovered || isMobile;

  if (!shouldShow) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 min-w-0"
    >
      <span className="text-lg font-semibold truncate block">Inwesol</span>
    </motion.div>
  );
}

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // Convert navMain to Links format
  const links: Links[] = navMain.map((item) => ({
    label: item.title,
    href: item.url,
    icon: <item.icon className="size-5" />,
  }));

  // Get active item based on current path
  const getActiveItem = React.useCallback(() => {
    return navMain.find((item) => {
      if (item.url === "/") return pathname === "/";
      return pathname.startsWith(item.url);
    });
  }, [pathname]);

  const activeItem = getActiveItem();
  const isCoCoActive = activeItem?.title === "CoCo";

  // Handle navigation
  const handleNavClick = (href: string) => {
    if (href.startsWith("http")) {
      window.open(href, "_blank");
    } else {
      router.push(href);
    }
  };

  return (
    <>
      <Sidebar>
        <SidebarBody className="h-full">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-[rgba(16,185,129,0.05)]">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="shrink-0">
                <Image
                  src="/images/logo.svg"
                  alt="CoCo AI Coach"
                  width={32}
                  height={32}
                  className="size-8"
                />
              </div>
              <SidebarHeaderText isMobile={isMobile} />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 bg-[rgba(16,185,129,0.05)] backdrop-blur-sm">
            {links.map((link) => (
              <SidebarLink
                key={link.label}
                link={link}
                isActive={activeItem?.title === link.label}
                onClick={() => handleNavClick(link.href)}
              />
            ))}
          </div>

          {/* Footer - User Nav */}
          <div className="border-t border-border/50 p-3 bg-[rgba(16,185,129,0.05)]">
            {user && <SidebarUserNav user={user} />}
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Chat History Sheet - Only show for CoCo section */}
      {isCoCoActive && (
        <>
          <ChatHistorySheet user={user}>
            <Button
              variant="outline"
              className="fixed right-4 top-[22px] z-40 h-10 px-3 gap-2"
            >
              <HistoryIcon size={20} />
              <span>Chat History</span>
              <span className="sr-only">Open chat history</span>
            </Button>
          </ChatHistorySheet>
          {/* New Chat button - Only on mobile, positioned below Chat History */}
          {isMobile && (
            <Button
              variant="outline"
              className="fixed right-4 top-[66px] z-40 h-10 px-3 gap-2"
              onClick={() => {
                router.push("/chat");
                router.refresh();
              }}
            >
              <PlusIcon size={18} />
              <span>New Chat</span>
            </Button>
          )}
        </>
      )}
    </>
  );
}
