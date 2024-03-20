import { useState as reactState } from "react";

interface StateType {
  [key: string]: any;
}
export default function useObject<T extends StateType>(initialState?: T) {
  const [state, setState] = reactState<T>((initialState as T) || {});

  const updateObject = <K extends keyof T>(field: K, value: T[K]) => {
    if (typeof state === "object") {
      setState({ ...state, [field]: value });
    }
  };

  return {
    state,
    setState,
    updateObject,
  };
}
