import { State } from "./state";
import { LocalStorageAdapter } from "./utils/storage-adapter";
import { DefaultState } from "./types";

export class LocalStorageState<S extends DefaultState> extends State<S> {
  private storage: LocalStorageAdapter<S>;
  private storageKey: string;

  constructor(storageKey: string, initialState: S | (() => S)) {
    const storage = new LocalStorageAdapter<S>();
    const storageValue = storage.get(storageKey);

    super(storageValue ?? initialState);

    if (!storageValue) {
      storage.set(storageKey, this.get());
    }

    this.storageKey = storageKey;
    this.storage = storage;
  }

  private updateStorageValues() {
    this.storage.set(this.storageKey, this.get());
  }

  setBy<K extends keyof S>(key: K, value: S[K]) {
    super.setBy(key, value);
    this.updateStorageValues();
  }

  set(value: Partial<S>) {
    super.set(value);
    this.updateStorageValues();
  }
}
