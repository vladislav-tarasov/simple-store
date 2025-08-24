import { Store } from "./store";
import { LocalStorageAdapter } from "./utils/storage-adapter";
import { DefaultStoreValues } from "./types";

export class PersistStore<V extends DefaultStoreValues> extends Store<V> {
  private storage: LocalStorageAdapter<V>;
  private storageKey: string;

  constructor({
    storageKey,
    initialValues,
  }: {
    storageName?: "local";
    storageKey: string;
    initialValues: () => V;
  }) {
    const storage = new LocalStorageAdapter<V>();

    const storageValue = storage.get(storageKey);

    super(() => storageValue ?? initialValues());

    if (!storageValue) {
      storage.set(storageKey, this.get());
    }

    this.storageKey = storageKey;
    this.storage = storage;
  }

  private updateStorageValues() {
    this.storage.set(this.storageKey, this.get());
  }

  setBy<K extends keyof V>(key: K, nextValue: (prevValue: V[K]) => V[K]) {
    super.setBy(key, nextValue);
    this.updateStorageValues();
  }

  set(nextValue: (nextState: V) => Partial<V>) {
    super.set(nextValue);
    this.updateStorageValues();
  }
}
