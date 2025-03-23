import type { User } from "~/entities/user";

interface MentionProps {
  user: User;
}

export const Mention = ({ user: { username } }: MentionProps) => {
  return (
    <span className="bg-light text-primary cursor-pointer rounded-sm p-2">
      @{username}
    </span>
  );
};
