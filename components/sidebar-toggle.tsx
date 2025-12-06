import type { ComponentProps } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebarContext } from "@/components/ui/aceternity-sidebar";
import { SidebarLeftIcon } from "./icons";
import { Button } from "./ui/button";

export function SidebarToggle({ className }: ComponentProps<typeof Button>) {
  const { open, setOpen } = useSidebarContext();

  const toggleSidebar = () => {
    if (setOpen) {
      setOpen(!open);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleSidebar}
            variant="outline"
            className={`md:px-2 md:h-fit ${className || ""}`}
          >
            <SidebarLeftIcon size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent align="start">Toggle Sidebar</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
