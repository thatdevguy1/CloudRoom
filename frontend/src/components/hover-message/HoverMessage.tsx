import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

function HoverMessage({ children, message }: any) {
  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm text-gray-700">{message}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

export default HoverMessage;
