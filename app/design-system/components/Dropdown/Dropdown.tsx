import { useMemo, useState, useRef } from "react";
import type { User } from "~/entities/user";

interface DropdownProps {
  users: User[];
  query: string;
  onSelect: (user: User) => void;
}

export const Dropdown = ({ users, query, onSelect }: DropdownProps) => {
  const [focusUser, setFocusUser] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => user.username.includes(query));
  }, [users, query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (!filteredUsers.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusUser((prev) =>
          prev === null ? 0 : Math.min(prev + 1, filteredUsers.length - 1),
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusUser((prev) =>
          prev === null ? filteredUsers.length - 1 : Math.max(prev - 1, 0),
        );
        break;
      case "Enter":
        e.preventDefault();
        if (!focusUser) break;
        onSelect(filteredUsers[focusUser]);
        break;
      default:
        break;
    }
  };

  return (
    <ul
      ref={listRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="focus-visible:border-primary flex min-w-48 list-none flex-col divide-y divide-gray-300 rounded-md border-1 border-solid border-gray-200 shadow-md focus:outline-none"
      role="dialog"
    >
      {filteredUsers.map((user, ix) => {
        return (
          <li
            className={`flex cursor-pointer flex-col px-4 py-3 ${
              focusUser === ix ? "bg-light" : ""
            } ${ix === 0 ? "rounded-t-md" : ""} ${
              ix === filteredUsers.length - 1 ? "rounded-b-md" : ""
            }`}
            key={user.username}
            onMouseEnter={() => setFocusUser(ix)}
            onMouseLeave={() => setFocusUser(null)}
            aria-selected={focusUser === ix}
            onClick={() => onSelect(user)}
          >
            <p className="text-primary">@{user.username}</p>
            <p className="text-sm text-gray-500">
              {user.firstName} {user.lastName}
            </p>
          </li>
        );
      })}
    </ul>
  );
};
