"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

/** GET `path` (pass null to skip). Keeps the previous data while reloading. */
export function useFetch(path) {
  const [state, setState] = useState({ data: null, error: null, loading: !!path });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!path) return;
    let off = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .get(path)
      .then((data) => !off && setState({ data, error: null, loading: false }))
      .catch((error) => !off && setState((s) => ({ ...s, error, loading: false })));
    return () => {
      off = true;
    };
  }, [path, tick]);
  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}
