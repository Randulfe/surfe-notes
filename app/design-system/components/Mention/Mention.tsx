import { useEffect, useRef, useState } from "react";
import type { User } from "~/entities/user";
import { Tooltip } from "../Tooltip/Tooltip";
import { TooltipContent } from "./TooltipContent";
import { isTargetInElement } from "~/utils/isTargetInElement";

interface MentionProps {
  user: User;
}

export const Mention = ({ user }: MentionProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const mentionRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleHoverState = (event: MouseEvent) => {
      if (!mentionRef.current || !tooltipRef.current || !event.target) return;

      const isOverMention = isTargetInElement(mentionRef.current, event.target);
      const isOverTooltip = isTargetInElement(tooltipRef.current, event.target);

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
