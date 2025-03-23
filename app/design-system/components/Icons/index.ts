export * from "./Email";
export * from "./Location";
export * from "./Phone";

export interface IconProps {
  fill?: string;
  size?: "s" | "m" | "l";
}

export const getSize = (size: IconProps["size"]): number => {
  if (size === "s") return 20;
  if (size === "m") return 24;
  if (size === "l") return 28;
  return 24;
};
