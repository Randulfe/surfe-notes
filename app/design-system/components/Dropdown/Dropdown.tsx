import { useMemo, useState, forwardRef } from "react";

interface DropdownProps<T> {
  data: T[];
  query: string;
  labelKey: keyof T;
  displayKeys?: (keyof T)[];
  prefix?: string;
  position?: { x: number; y: number };
  onSelect: (data: T) => void;
}

export const Dropdown = forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends Record<string, any>>(
    {
      data,
      labelKey,
      displayKeys,
      query,
      prefix,
      position = { x: 0, y: 0 },
      onSelect,
    }: DropdownProps<T>,
    ref: React.ForwardedRef<HTMLUListElement>,
  ) => {
    const [focusItem, setFocusItem] = useState<number | null>(null);

    const filteredData = useMemo(() => {
      if (!query) return data.slice(0, 5);
      return data.filter((item) => item[labelKey].includes(query)).slice(0, 5);
    }, [data, query, labelKey]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
      if (!filteredData.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusItem((prev) =>
            prev === null ? 0 : Math.min(prev + 1, filteredData.length - 1),
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusItem((prev) =>
            prev === null ? filteredData.length - 1 : Math.max(prev - 1, 0),
          );
          break;
        case "Enter":
          e.preventDefault();
          if (!focusItem) break;
          onSelect(filteredData[focusItem]);
          break;
        default:
          break;
      }
    };

    if (!filteredData.length) return null;

    return (
      <ul
        ref={ref}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="focus-visible:border-primary bg-lighter absolute z-10 flex min-w-48 list-none flex-col divide-y divide-gray-300 rounded-md border-1 border-solid border-gray-200 shadow-md focus:outline-none"
        role="dialog"
        style={{
          left: `${position.x}px`,
          top: `${position.y + 20}px`,
        }}
      >
        {filteredData.map((item, ix) => {
          return (
            <li
              className={`flex cursor-pointer flex-col px-4 py-3 ${
                focusItem === ix ? "bg-light" : ""
              } ${ix === 0 ? "rounded-t-md" : ""} ${
                ix === filteredData.length - 1 ? "rounded-b-md" : ""
              }`}
              key={item[labelKey]}
              onMouseEnter={() => setFocusItem(ix)}
              onMouseLeave={() => setFocusItem(null)}
              aria-selected={focusItem === ix}
              onClick={() => onSelect(item)}
            >
              <p className="text-primary">
                {prefix && prefix}
                {item[labelKey]}
              </p>
              {displayKeys && (
                <p className="text-sm text-gray-500">
                  {displayKeys.map((key) => item[key]).join(" ")}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    );
  },
);

Dropdown.displayName = "Dropdown";
