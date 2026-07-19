"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return null;
}

/** Returns null on the server / before hydration, then a stable Date snapshot on the client. */
export function useClientNow(): Date | null {
  const cachedNow = useRef<Date | null>(null);
  const getSnapshot = useCallback(() => {
    if (cachedNow.current === null) {
      cachedNow.current = new Date();
    }
    return cachedNow.current;
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
