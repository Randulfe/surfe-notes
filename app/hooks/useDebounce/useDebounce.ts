import { useRef, useEffect } from "react";

export const useDebounce = (
  value: string,
  callback: (value: string) => void,
  delay = 100,
) => {
  const delayRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (delayRef.current) {
      clearTimeout(delayRef.current);
    }
    delayRef.current = setTimeout(() => callback(value), delay);

    return () => {
      if (delayRef.current) {
        clearTimeout(delayRef.current);
      }
    };
  }, [value, delay, callback]);
};
