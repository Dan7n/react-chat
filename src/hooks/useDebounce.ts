import { useState, useEffect } from "react";

/**
 *
 * @param value the string value that we want to use our debounce on
 * @param delay the delay in ms
 * @returns debounced version of the value that updates after the delay time
 */

export const useDebounce = (value: string, delay: number) => {
  const [debounceState, setDebounceState] = useState(value);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebounceState(value);
    }, delay);

    return () => {
      clearTimeout(debounce);
    };
  }, [value, delay]);

  return debounceState;
};
