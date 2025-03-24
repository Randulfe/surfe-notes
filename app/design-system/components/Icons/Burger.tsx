import { getSize, type IconProps } from ".";

export const BurgerIcon = ({
  fill = "currentColor",
  size = "m",
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={getSize(size)}
      height={getSize(size)}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        stroke={fill}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
};
