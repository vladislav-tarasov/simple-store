abstract class StorageAdapter<V = unknown> {
  protected storage: Storage | null = null;

  get(key: string): V | null {
    const storageValue = this.storage?.getItem(key);

    if (!storageValue) return null;

    try {
      return JSON.parse(storageValue);
    } catch (err) {
      return null;
    }
  }

  set(key: string, value: V): void {
    this.storage?.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    this.storage?.removeItem(key);
  }
}

export class LocalStorageAdapter<V> extends StorageAdapter<V> {
  constructor() {
    super();

    try {
      this.storage = window.localStorage;

      this.storage.setItem(
        "__test__storage__key__",
        "__test__storage__value__"
      );
      this.storage.getItem("__test__storage__key__");
      this.storage.removeItem("__test__storage__key__");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      this.storage = null;
    }
  }
}
