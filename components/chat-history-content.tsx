"use client";

import { isToday, isYesterday, subMonths, subWeeks } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import type { User } from "next-auth";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Chat } from "@/lib/db/schema";
import { fetcher } from "@/lib/utils";
import useSWRInfinite from "swr/infinite";
import { LoaderIcon, TrashIcon, MoreHorizontalIcon } from "./icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type GroupedChats = {
  today: Chat[];
  yesterday: Chat[];
  lastWeek: Chat[];
  lastMonth: Chat[];
  older: Chat[];
};

export interface ChatHistory {
  chats: Array<Chat>;
  hasMore: boolean;
}

const PAGE_SIZE = 20;

const groupChatsByDate = (chats: Chat[]): GroupedChats => {
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const oneMonthAgo = subMonths(now, 1);

  return chats.reduce(
    (groups, chat) => {
      const chatDate = new Date(chat.createdAt);

      if (isToday(chatDate)) {
        groups.today.push(chat);
      } else if (isYesterday(chatDate)) {
        groups.yesterday.push(chat);
      } else if (chatDate > oneWeekAgo) {
        groups.lastWeek.push(chat);
      } else if (chatDate > oneMonthAgo) {
        groups.lastMonth.push(chat);
      } else {
        groups.older.push(chat);
      }

      return groups;
    },
    {
      today: [],
      yesterday: [],
      lastWeek: [],
      lastMonth: [],
      older: [],
    } as GroupedChats
  );
};

export function getChatHistoryPaginationKey(
  pageIndex: number,
  previousPageData: ChatHistory
) {
  if (previousPageData && previousPageData.hasMore === false) {
    return null;
  }

  if (pageIndex === 0) return `/api/history?limit=${PAGE_SIZE}`;

  const firstChatFromPage = previousPageData.chats.at(-1);

  if (!firstChatFromPage) return null;

  return `/api/history?ending_before=${firstChatFromPage.id}&limit=${PAGE_SIZE}`;
}

function ChatItem({
  chat,
  isActive,
  onDelete,
}: {
  chat: Chat;
  isActive: boolean;
  onDelete: (chatId: string) => void;
}) {
  return (
    <div className="group relative">
      <Link
        href={`/chat/${chat.id}`}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-[rgba(16,185,129,0.1)] ${
          isActive ? "bg-[rgba(16,185,129,0.2)] font-medium" : ""
        }`}
      >
        <span className="flex-1 truncate text-sm">{chat.title}</span>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 size-6 opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontalIcon size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/15 focus:text-destructive"
            onSelect={() => onDelete(chat.id)}
          >
            <TrashIcon />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function ChatHistoryContent({ user }: { user: User | undefined }) {
  const { id } = useParams();
  const router = useRouter();

  const {
    data: paginatedChatHistories,
    setSize,
    isValidating,
    isLoading,
    mutate,
  } = useSWRInfinite<ChatHistory>(getChatHistoryPaginationKey, fetcher, {
    fallbackData: [],
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const hasReachedEnd = paginatedChatHistories
    ? paginatedChatHistories.some((page) => page.hasMore === false)
    : false;

  const hasEmptyChatHistory = paginatedChatHistories
    ? paginatedChatHistories.every((page) => page.chats.length === 0)
    : false;

  const handleDelete = async () => {
    const deletePromise = fetch(`/api/chat?id=${deleteId}`, {
      method: "DELETE",
    });

    toast.promise(deletePromise, {
      loading: "Deleting chat...",
      success: () => {
        mutate((chatHistories) => {
          if (chatHistories) {
            return chatHistories.map((chatHistory) => ({
              ...chatHistory,
              chats: chatHistory.chats.filter((chat) => chat.id !== deleteId),
            }));
          }
        });

        return "Chat deleted successfully";
      },
      error: "Failed to delete chat",
    });

    setShowDeleteDialog(false);

    if (deleteId === id) {
      router.push("/");
    }
  };

  if (!user) {
    return (
      <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2 py-8">
        Login to save and revisit previous chats!
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="px-2 py-1 text-xs text-muted-foreground">Today</div>
        <div className="flex flex-col gap-2">
          {[44, 32, 28, 64, 52].map((item) => (
            <div
              key={item}
              className="rounded-md h-8 flex gap-2 px-2 items-center"
            >
              <div
                className="h-4 rounded-md flex-1 max-w-[--skeleton-width] bg-muted"
                style={
                  {
                    "--skeleton-width": `${item}%`,
                  } as React.CSSProperties
                }
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hasEmptyChatHistory) {
    return (
      <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2 py-8">
        Your conversations will appear here once you start chatting!
      </div>
    );
  }

  const chatsFromHistory = paginatedChatHistories
    ? paginatedChatHistories.flatMap(
        (paginatedChatHistory) => paginatedChatHistory.chats
      )
    : [];

  const groupedChats = groupChatsByDate(chatsFromHistory);

  return (
    <>
      <div className="flex flex-col gap-6">
        {groupedChats.today.length > 0 && (
          <div>
            <div className="px-2 py-1 text-xs text-muted-foreground">Today</div>
            <div className="space-y-1">
              {groupedChats.today.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === id}
                  onDelete={(chatId) => {
                    setDeleteId(chatId);
                    setShowDeleteDialog(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {groupedChats.yesterday.length > 0 && (
          <div>
            <div className="px-2 py-1 text-xs text-muted-foreground">
              Yesterday
            </div>
            <div className="space-y-1">
              {groupedChats.yesterday.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === id}
                  onDelete={(chatId) => {
                    setDeleteId(chatId);
                    setShowDeleteDialog(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {groupedChats.lastWeek.length > 0 && (
          <div>
            <div className="px-2 py-1 text-xs text-muted-foreground">
              Last 7 days
            </div>
            <div className="space-y-1">
              {groupedChats.lastWeek.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === id}
                  onDelete={(chatId) => {
                    setDeleteId(chatId);
                    setShowDeleteDialog(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {groupedChats.lastMonth.length > 0 && (
          <div>
            <div className="px-2 py-1 text-xs text-muted-foreground">
              Last 30 days
            </div>
            <div className="space-y-1">
              {groupedChats.lastMonth.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === id}
                  onDelete={(chatId) => {
                    setDeleteId(chatId);
                    setShowDeleteDialog(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {groupedChats.older.length > 0 && (
          <div>
            <div className="px-2 py-1 text-xs text-muted-foreground">
              Older than last month
            </div>
            <div className="space-y-1">
              {groupedChats.older.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === id}
                  onDelete={(chatId) => {
                    setDeleteId(chatId);
                    setShowDeleteDialog(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {!hasReachedEnd && (
        <motion.div
          className="p-2 text-zinc-500 dark:text-zinc-400 flex flex-row gap-2 items-center mt-8"
          onViewportEnter={() => {
            if (!isValidating && !hasReachedEnd) {
              setSize((size) => size + 1);
            }
          }}
        >
          <div className="animate-spin">
            <LoaderIcon />
          </div>
          <div>Loading Chats...</div>
        </motion.div>
      )}

      {hasReachedEnd && (
        <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2 mt-8">
          You have reached the end of your chat history.
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              chat and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
