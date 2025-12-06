"use client";

import * as React from "react";
import type { User } from "next-auth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { ChatHistoryContent } from "@/components/chat-history-content";

interface ChatHistorySheetProps {
  user: User | undefined;
  children?: React.ReactNode;
}

export function ChatHistorySheet({ user, children }: ChatHistorySheetProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {children ? (
        <SheetTrigger asChild>{children}</SheetTrigger>
      ) : (
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed right-4 top-4 z-40 size-10 rounded-full bg-[rgba(16,185,129,0.2)] hover:bg-[rgba(16,185,129,0.3)] border border-green-500/20"
          >
            <History className="size-5 text-green-600" />
            <span className="sr-only">Open chat history</span>
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] p-0 bg-background"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="text-xl font-semibold">
            Chat History
          </SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-4">
            <ChatHistoryContent user={user} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
