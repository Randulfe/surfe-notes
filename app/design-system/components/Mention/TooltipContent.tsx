import type { User } from "~/entities/user";
import { EmailIcon, LocationIcon, PhoneIcon } from "../Icons";
import { getLocationUrl } from "~/utils/getLocationUrl";

interface TooltipContentProps {
  user: User;
}

export const TooltipContent = ({ user }: TooltipContentProps) => {
  console.log(user);
  return (
    <>
      <div>
        <p className="text-primary">@{user.username}</p>
        {(user.firstName || user.lastName) && (
          <p className="text-sm text-gray-500">
            {user?.firstName} {user.lastName}
          </p>
        )}
      </div>
      {(user.email || user.phone || user.location) && (
        <div className="flex flex-row gap-2">
          {user.email && (
            <a
              href={`mailto:${user.email}`}
              className="hover:text-primary text-gray-600"
            >
              <EmailIcon size="s" />
            </a>
          )}
          {user.phone && (
            <a
              href={`tel:${user.phone}`}
              className="hover:text-primary text-gray-600"
            >
              <PhoneIcon size="s" />
            </a>
          )}
          {user.location && (
            <a
              href={getLocationUrl(user.location)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary text-gray-600"
            >
              <LocationIcon size="s" />
            </a>
          )}
        </div>
      )}
    </>
  );
};
