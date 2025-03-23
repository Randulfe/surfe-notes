import type { User, Location } from "~/entities/user";
import { EmailIcon, LocationIcon, PhoneIcon } from "../Icons";

interface TooltipProps {
  user: User;
}

function getGoogleMapsUrl(location: Location): string {
  const fullAddress = `${location.street}, ${location.city}, ${location.state} ${location.postcode}`;
  const encodedAddress = encodeURIComponent(fullAddress);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
}

export const Tooltip = ({
  user: { username, firstName, lastName, email, phone, location },
}: TooltipProps) => {
  return (
    <div
      role="dialog"
      className="focus-visible:border-primary flex min-w-48 flex-col gap-3 rounded-md border-1 border-solid border-gray-200 p-4 shadow-md focus:outline-none"
    >
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
          href={getGoogleMapsUrl(location)}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary text-gray-600"
        >
          <LocationIcon size="s" />
        </a>
      </div>
    </div>
  );
};
