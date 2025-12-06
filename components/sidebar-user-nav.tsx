"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import type { User } from "next-auth";
import { LogOut, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarContext } from "@/components/ui/aceternity-sidebar";

interface SidebarUserNavProps {
  user: User;
}

export function SidebarUserNav({ user }: SidebarUserNavProps) {
  const isMobile = useIsMobile();
  const { open, isHovered } = useSidebarContext();
  const shouldShowText = open || isHovered || isMobile;
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
        <AvatarFallback className="size-8 flex items-center justify-center">
          {user.name ? (
            user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
          ) : (
            <UserIcon className="size-4" />
          )}
        </AvatarFallback>
      </Avatar>
      {shouldShowText && (
        <>
          <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
            <span className="truncate font-semibold">
              {user.name || "User"}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
            title={isSigningOut ? "Signing Out..." : "Sign Out"}
          >
            <LogOut className="size-4" />
          </Button>
        </>
      )}
    </div>
  );
}
