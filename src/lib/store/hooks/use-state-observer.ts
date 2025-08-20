import { useCallback, useEffect, useState } from "react";
import { State } from "../state";
import { DefaultState } from "../types";

export const useStateObserverBy = <
  S extends DefaultState,
  K extends keyof S = keyof S,
  U extends S[K] | ((prevValue: S[K]) => S[K]) =
    | S[K]
    | ((prevValue: S[K]) => S[K])
>(
  state: State<S>,
  key: K
): [S[K], (nextValue: U) => void] => {
  const [value, setValue] = useState(() => state.getBy(key));

  useEffect(
    () =>
      state.watchBy(key, (nextValue) => {
        setValue(() => nextValue as S[K]);
      }),
    [state, key]
  );

  const updater = useCallback(
    (nextValue: U) => {
      const value =
        typeof nextValue === "function"
          ? nextValue(state.getBy(key))
          : nextValue;

      state.setBy(key, value);
    },
    [state, key]
  );

  return [value, updater];
};
