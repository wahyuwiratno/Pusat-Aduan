import { useEffect, useRef } from "react";

export function useAutoRefresh(callback, { enabled = true, interval = 15000 } = {}) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return undefined;
    const id = setInterval(() => {
      callbackRef.current?.();
    }, interval);

    return () => clearInterval(id);
  }, [enabled, interval]);
}
