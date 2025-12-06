"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

// Context for sidebar state
type SidebarContextProps = {
  open: boolean;
  setOpen:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((open: boolean) => void);
  isHovered?: boolean;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebarContext() {
  const context = React.useContext(SidebarContext);
  // Return default values if not within SidebarProvider for backward compatibility
  if (!context) {
    return {
      open: false,
      setOpen: () => {},
      isHovered: false,
    };
  }
  return context;
}

// SidebarProvider
interface SidebarProviderProps {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isHovered?: boolean;
}

export function SidebarProvider({
  children,
  open: openProp,
  setOpen: setOpenProp,
  isHovered = false,
}: SidebarProviderProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = openProp ?? internalOpen;
  const setOpen = setOpenProp ?? setInternalOpen;

  return (
    <TooltipProvider>
      <SidebarContext.Provider value={{ open, setOpen, isHovered }}>
        {children}
      </SidebarContext.Provider>
    </TooltipProvider>
  );
}

// Links interface
export interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

// Sidebar component
interface SidebarProps {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}

export function Sidebar({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: SidebarProps) {
  const { open: contextOpen, setOpen: contextSetOpen } = useSidebarContext();
  const open = openProp ?? contextOpen;
  const setOpenRaw = setOpenProp ?? contextSetOpen;
  const isMobile = useIsMobile();

  // Normalize setOpen to Dispatch type
  const setOpen: React.Dispatch<React.SetStateAction<boolean>> =
    React.useCallback(
      (value: React.SetStateAction<boolean>) => {
        if (typeof setOpenRaw === "function") {
          if (setOpenRaw.length === 1) {
            // Simple function that takes boolean
            const newValue = typeof value === "function" ? value(open) : value;
            (setOpenRaw as (open: boolean) => void)(newValue);
          } else {
            // Dispatch type
            (setOpenRaw as React.Dispatch<React.SetStateAction<boolean>>)(
              value
            );
          }
        }
      },
      [open, setOpenRaw]
    );

  if (isMobile) {
    return (
      <MobileSidebar open={open} setOpen={setOpen}>
        {children}
      </MobileSidebar>
    );
  }

  return (
    <DesktopSidebar open={open} setOpen={setOpen} animate={animate}>
      {children}
    </DesktopSidebar>
  );
}

// SidebarBody
interface SidebarBodyProps extends React.ComponentProps<typeof motion.div> {
  children: React.ReactNode;
}

export function SidebarBody({
  children,
  className,
  ...props
}: SidebarBodyProps) {
  return (
    <motion.div className={cn("flex flex-col h-full", className)} {...props}>
      {children}
    </motion.div>
  );
}

// DesktopSidebar
interface DesktopSidebarProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
  className?: string;
}

export function DesktopSidebar({
  children,
  open,
  setOpen,
  animate = true,
  className,
}: DesktopSidebarProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const shouldExpand = open || isHovered;
  const sidebarWidth = shouldExpand ? 256 : 64;

  React.useEffect(() => {
    // Update CSS variable for main content spacing
    const root = document.documentElement;
    root.style.setProperty("--sidebar-width", `${sidebarWidth}px`);

    return () => {
      root.style.removeProperty("--sidebar-width");
    };
  }, [sidebarWidth]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, isHovered }}>
      <motion.div
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-[rgba(16,185,129,0.1)] backdrop-blur-sm border-r border-border/50 shadow-lg",
          className
        )}
        initial={false}
        animate={{
          width: sidebarWidth,
        }}
        transition={
          animate ? { duration: 0.3, ease: "easeInOut" } : { duration: 0 }
        }
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full overflow-hidden">{children}</div>
      </motion.div>
    </SidebarContext.Provider>
  );
}

// MobileSidebar
interface MobileSidebarProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export function MobileSidebar({
  children,
  open,
  setOpen,
  className,
}: MobileSidebarProps) {
  // On mobile, always show text when open (no hover state)
  const isHovered = false;
  const shouldExpand = open;
  const sidebarWidth = shouldExpand ? 256 : 64;

  React.useEffect(() => {
    // Update CSS variable for main content spacing
    const root = document.documentElement;
    root.style.setProperty("--sidebar-width", `${sidebarWidth}px`);

    return () => {
      root.style.removeProperty("--sidebar-width");
    };
  }, [sidebarWidth]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, isHovered }}>
      <motion.div
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-[rgba(16,185,129,0.1)] backdrop-blur-sm border-r border-border/50 shadow-lg",
          className
        )}
        initial={false}
        animate={{
          width: sidebarWidth,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col h-full overflow-hidden">{children}</div>
      </motion.div>
    </SidebarContext.Provider>
  );
}

// SidebarLink
interface SidebarLinkProps {
  link: Links;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarLink({
  link,
  className,
  isActive = false,
  onClick,
}: SidebarLinkProps) {
  const context = React.useContext(SidebarContext);
  const open = context?.open ?? false;
  const isHovered = context?.isHovered ?? false;
  const setOpen = context?.setOpen;
  const isMobile = useIsMobile();
  const shouldShowText = open || isHovered || isMobile;

  return (
    <a
      href={link.href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
        if (isMobile && setOpen) {
          // Close sidebar on mobile after navigation
          setTimeout(() => {
            if (typeof setOpen === "function") {
              setOpen(false);
            }
          }, 100);
        }
      }}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
        "hover:bg-[rgba(16,185,129,0.2)] hover:scale-[1.02]",
        isActive && "bg-white text-black font-medium shadow-sm",
        !isActive && "text-foreground",
        !shouldShowText && "justify-center px-2",
        className
      )}
    >
      <span className={cn("flex-shrink-0", !shouldShowText && "mx-auto")}>
        {link.icon}
      </span>
      {shouldShowText && (
        <motion.span
          initial={false}
          animate={{ opacity: shouldShowText ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="truncate"
        >
          {link.label}
        </motion.span>
      )}
    </a>
  );
}
