import { useEffect, useState } from "react";

/* ==========================================
   DEBOUNCES A RAPIDLY CHANGING VALUE
   USED BY THE SEARCHABLE SELECTORS
========================================== */

export function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}
