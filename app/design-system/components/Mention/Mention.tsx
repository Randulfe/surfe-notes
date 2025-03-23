import type { User } from "~/entities/user";

interface MentionProps {
  user: User;
}

export const Mention = ({ user: { username } }: MentionProps) => {
  return (
    <span className="bg-light text-primary m-1 cursor-pointer rounded-sm p-1">
      @{username}
    </span>
  );
};
