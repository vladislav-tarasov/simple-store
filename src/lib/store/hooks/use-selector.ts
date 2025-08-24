import { useCallback, useEffect, useState } from "react";
import { Store } from "../store";
import { DefaultStoreValues } from "../types";

export function useSelector<
  S extends DefaultStoreValues,
  K extends keyof S = keyof S
>(store: Store<S>, key: K) {
  const [value, setValue] = useState(() => store.getBy(key));

  useEffect(
    () => store.watchBy(key, (nextValue) => setValue(() => nextValue as S[K])),
    [key, store]
  );

  const updater = useCallback(
    (nextValue: (prev: S[K]) => S[K]) => store.setBy(key, nextValue),
    [key, store]
  );

  return [value, updater] as const;
}
