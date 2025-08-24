import { useCallback, useEffect, useState } from "react";
import { Store } from "../store";
import { DefaultStoreValues } from "../types";

export function useMapSelector<
  S extends DefaultStoreValues,
  K extends keyof S = keyof S,
  D = Pick<S, K>
>(store: Store<S>, keys: K[]) {
  const [value, setValue] = useState<D>(() =>
    keys.reduce((acc, key) => ({ ...acc, [key]: store.getBy(key) }), {} as D)
  );

  useEffect(() => {
    const unsubscribe = keys.map((key) =>
      store.watchBy(key, (nextValue) =>
        setValue((prev) => ({ ...prev, [key]: nextValue }))
      )
    );

    return () => {
      unsubscribe.forEach((f) => f());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, ...keys]);

  const updater = useCallback<typeof store.set>(
    (nextValue) => store.set(nextValue),
    [store]
  );

  return [value, updater] as const;
}
