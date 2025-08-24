import { DefaultStoreValues } from "../types";

export class EventManager<
  V extends DefaultStoreValues,
  K extends keyof V = keyof V
> {
  private listeners: Map<K, Set<(value: V[K]) => void>> = new Map();

  subscribe(key: K, cb: (value: V[K]) => void) {
    const callbacks = this.listeners.get(key);

    if (callbacks && callbacks?.size !== 0) {
      callbacks.add(cb);
    } else {
      this.listeners.set(key, new Set([cb]));
    }
  }

  unsubscribe(key: K, cb: (value: V[K]) => void) {
    this.listeners.get(key)?.delete(cb);
  }

  notify(key: K, v: V[K]) {
    this.listeners.get(key)?.forEach((cb) => cb(v));
  }
}
