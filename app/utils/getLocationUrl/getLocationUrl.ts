import type { Location } from "~/entities/user";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1";

export const getLocationUrl = (location: Location): string => {
  if (
    !location.street ||
    !location.city ||
    !location.state ||
    !location.postcode
  ) {
    return "";
  }
  const fullAddress = `${location.street}, ${location.city}, ${location.state} ${location.postcode}`;
  const encodedAddress = encodeURIComponent(fullAddress);
  return `${GOOGLE_MAPS_URL}&query=${encodedAddress}`;
};
