import type { User } from "~/entities/user";
import { EmailIcon, LocationIcon, PhoneIcon } from "../Icons";
import { getLocationUrl } from "~/utils/getLocationUrl";

interface TooltipContentProps {
  user: User;
}

export const TooltipContent = ({
  user: { username, firstName, lastName, email, phone, location },
}: TooltipContentProps) => {
  return (
    <>
      <div>
        <p className="text-primary">@{username}</p>
        <p className="text-sm text-gray-500">
          {firstName} {lastName}
        </p>
      </div>
      <div className="flex flex-row gap-2">
        <a
          href={`mailto:${email}`}
          className="hover:text-primary text-gray-600"
        >
          <EmailIcon size="s" />
        </a>
        <a href={`phone:${phone}`} className="hover:text-primary text-gray-600">
          <PhoneIcon size="s" />
        </a>
        <a
          href={getLocationUrl(location)}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary text-gray-600"
        >
          <LocationIcon size="s" />
        </a>
      </div>
    </>
  );
};
