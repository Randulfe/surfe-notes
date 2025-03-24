import type { ComponentPropsWithoutRef } from "react";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
}

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <>
      {label && (
        <label className="pb-3 text-sm" htmlFor={props?.id}>
          {label}
        </label>
      )}
      <input
        className="w-full rounded-md border-2 border-solid border-gray-300 p-4"
        {...props}
      />
    </>
  );
};
