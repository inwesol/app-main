'use client';

import * as React from 'react';
import type { User } from 'next-auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MessageSquare, PlusIcon, ChevronLeft } from 'lucide-react';
import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

// This is sample data
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Chat History',
      url: '#',
      icon: MessageSquare,
      isActive: true,
    },
    //   {
    //     title: "Inbox",
    //     url: "#",
    //     icon: Inbox,
    //     isActive: false,
    //   },
    //   {
    //     title: "Drafts",
    //     url: "#",
    //     icon: File,
    //     isActive: false,
    //   },
    //   {
    //     title: "Sent",
    //     url: "#",
    //     icon: Send,
    //     isActive: false,
    //   },
    //   {
    //     title: "Junk",
    //     url: "#",
    //     icon: ArchiveX,
    //     isActive: false,
    //   },
    //   {
    //     title: "Trash",
    //     url: "#",
    //     icon: Trash2,
    //     isActive: false,
    //   },
  ],
  // Commented out mail data since we're not using it anymore
  // mails: [
  //   {
  //     name: "William Smith",
  //     email: "williamsmith@example.com",
  //     subject: "Meeting Tomorrow",
  //     date: "09:34 AM",
  //     teaser:
  //       "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
  //   },
  //   // ... rest of mail data
  // ],
};

export function AppSidebar({
  user,
  ...props
}: { user: User | undefined } & React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const [showSecondSidebar, setShowSecondSidebar] = React.useState(false);

  // Handler for new chat creation
  const handleNewChat = () => {
    setOpenMobile(false);
    setShowSecondSidebar(false);
    router.push('/');
    router.refresh();
  };

  // Handle navigation item click
  const handleNavItemClick = (item: (typeof data.navMain)[0]) => {
    setActiveItem(item);
    if (isMobile) {
      setShowSecondSidebar(true);
    } else {
      setOpen(true);
    }
  };

  // Handle back button for mobile
  const handleMobileBack = () => {
    setShowSecondSidebar(false);
  };

  // Function to render content based on active item
  const renderContent = () => {
    switch (activeItem?.title) {
      case 'Chat History':
        return (
          <div className="p-2">
            <SidebarHistory user={user} />
          </div>
        );

      // case "Inbox":
      //   // TODO: Add Inbox component here
      //   return (
      //     <div className="p-4 text-sm text-muted-foreground">
      //       Inbox component will be added here
      //     </div>
      //   );

      // case "Drafts":
      //   // TODO: Add Drafts component here
      //   return (
      //     <div className="p-4 text-sm text-muted-foreground">
      //       Drafts component will be added here
      //     </div>
      //   );

      // case "Sent":
      //   // TODO: Add Sent component here
      //   return (
      //     <div className="p-4 text-sm text-muted-foreground">
      //       Sent component will be added here
      //     </div>
      //   );

      // case "Junk":
      //   // TODO: Add Junk component here
      //   return (
      //     <div className="p-4 text-sm text-muted-foreground">
      //       Junk component will be added here
      //     </div>
      //   );

      // case "Trash":
      //   // TODO: Add Trash component here
      //   return (
      //     <div className="p-4 text-sm text-muted-foreground">
      //       Trash component will be added here
      //     </div>
      //   );

      default:
        return (
          <div className="p-4 text-sm text-muted-foreground">
            Select an item from the sidebar
          </div>
        );
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row !bg-[rgba(16,185,129,0.1)]"
      {...props}
    >
      {/* Mobile: Single sidebar that switches between outer and inner */}
      {isMobile ? (
        <Sidebar
          collapsible="none"
          className="w-full !bg-[rgba(16,185,129,0.1)] relative"
        >
          {!showSecondSidebar ? (
            // Outer sidebar for mobile
            <>
              <SidebarHeader>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      size="lg"
                      asChild
                      className="h-8 p-0 hover:bg-transparent"
                    >
                      <a>
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg ">
                          <Image
                            src="/images/logo.svg"
                            alt="CoCo AI Coach"
                            width={32}
                            height={32}
                            className="size-8"
                          />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                          <span className="truncate font-semibold">
                            CoCo - AI Coach
                          </span>
                        </div>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>

                {/* New Chat Button - Top Right Icon for Mobile */}
                <div className="absolute top-4 right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNewChat}
                        className="size-8 p-0 rounded-md border-2 border-black bg-transparent "
                      >
                        <PlusIcon className="size-4 text-black" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent align="end">New Chat</TooltipContent>
                  </Tooltip>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent className="px-1.5">
                    <SidebarMenu>
                      {data.navMain.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            onClick={() => handleNavItemClick(item)}
                            isActive={activeItem?.title === item.title}
                            className="px-2.5 data-[state=open]:hover:bg-transparent data-[active=true]:bg-transparent hover:bg-[rgba(16,185,129,0.2)]"
                          >
                            <item.icon className="text-black" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className="pb-6">
                {user && <SidebarUserNav user={user} />}
              </SidebarFooter>
            </>
          ) : (
            // Inner sidebar for mobile
            <>
              <SidebarHeader className="gap-3.5 border-b p-4">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Back button for mobile */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMobileBack}
                      className="p-1 h-fit hover:bg-transparent"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <div className="text-base font-medium text-foreground">
                      {activeItem?.title}
                    </div>
                  </div>
                  {activeItem?.title === 'Chat History' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          type="button"
                          className="p-2 h-fit hover:bg-transparent"
                          onClick={handleNewChat}
                        >
                          <PlusIcon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent align="end">New Chat</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Label className="flex items-center gap-2 text-sm">
                      <span>Unreads</span>
                      <Switch className="shadow-none" />
                    </Label>
                  )}
                </div>
                <SidebarInput
                  placeholder={
                    activeItem?.title === 'Chat History'
                      ? 'Search chats...'
                      : `Search ${activeItem?.title.toLowerCase()}...`
                  }
                />
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>{renderContent()}</SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </>
          )}
        </Sidebar>
      ) : (
        // Desktop: Both sidebars side by side
        <>
          {/* First sidebar - Main navigation */}
          <Sidebar
            collapsible="none"
            className="!w-[calc(var(--sidebar-width-icon)_+_2px)] border-r !bg-[rgba(16,185,129,0.1)] relative"
          >
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    asChild
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    <a>
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg ">
                        <Image
                          src="/images/logo.svg"
                          alt="CoCo AI Coach"
                          width={32}
                          height={32}
                          className="size-8"
                        />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                        <span className="truncate font-semibold">
                          CoCo - AI Coach
                        </span>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent className="px-0">
                  <SidebarMenu>
                    {data.navMain.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          tooltip={{
                            children: item.title,
                            hidden: false,
                          }}
                          onClick={() => handleNavItemClick(item)}
                          isActive={activeItem?.title === item.title}
                          className="px-2 data-[state=open]:hover:bg-transparent data-[active=true]:bg-transparent hover:bg-[rgba(16,185,129,0.2)]"
                        >
                          <item.icon className="text-black" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="pb-2">
              {user && <SidebarUserNav user={user} />}
            </SidebarFooter>
          </Sidebar>

          {/* Second sidebar - Content area */}
          <Sidebar
            collapsible="none"
            className="flex-1 !bg-[rgba(16,185,129,0.1)]"
          >
            <SidebarHeader className="gap-3.5 border-b p-4 mr-10">
              <div className="flex w-full items-center justify-between">
                <div className="text-base font-medium text-foreground">
                  {activeItem?.title}
                </div>
                {activeItem?.title === 'Chat History' ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        type="button"
                        className="p-2 h-fit hover:bg-transparent"
                        onClick={handleNewChat}
                      >
                        <PlusIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent align="end">New Chat</TooltipContent>
                  </Tooltip>
                ) : (
                  <Label className="flex items-center gap-2 text-sm">
                    <span>Unreads</span>
                    <Switch className="shadow-none" />
                  </Label>
                )}
              </div>
              <SidebarInput
                placeholder={
                  activeItem?.title === 'Chat History'
                    ? 'Search chats...'
                    : `Search ${activeItem?.title.toLowerCase()}...`
                }
              />
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup className="pr-10">
                <SidebarGroupContent>
                  <div></div>
                  {renderContent()}
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </>
      )}
    </Sidebar>
  );
}
