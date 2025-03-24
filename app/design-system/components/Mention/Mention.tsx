import { useEffect, useRef, useState } from "react";
import type { User } from "~/entities/user";
import { Tooltip } from "../Tooltip/Tooltip";
import { TooltipContent } from "./TooltipContent";

interface MentionProps {
  user: User;
}

export const Mention = ({ user }: MentionProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const mentionRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleHoverState = (event: MouseEvent) => {
      if (!mentionRef.current || !tooltipRef.current) return;

      const isOverMention = mentionRef.current.contains(event.target as Node);
      const isOverTooltip = tooltipRef.current.contains(event.target as Node);

      if (!isOverMention && !isOverTooltip) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousemove", handleHoverState);
    document.addEventListener("click", handleHoverState);

    return () => {
      document.removeEventListener("mousemove", handleHoverState);
      document.removeEventListener("click", handleHoverState);
    };
  }, []);

  return (
    <span
      ref={mentionRef}
      className="bg-light text-primary relative m-1 cursor-pointer rounded-sm p-1"
      onMouseEnter={() => setShowTooltip(true)}
    >
      @{user.username}
      {showTooltip && (
        <Tooltip ref={tooltipRef}>
          <TooltipContent user={user} />
        </Tooltip>
      )}
    </span>
  );
};
