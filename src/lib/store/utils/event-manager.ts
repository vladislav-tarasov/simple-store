import { DefaultState } from "../types";

export class EventManager<S extends DefaultState, K extends keyof S = keyof S> {
  private listeners: Map<K, Set<(value: S[K]) => void>> = new Map();

  subscribe(key: K, cb: (value: S[K]) => void) {
    const callbacks = this.listeners.get(key);

    if (callbacks && callbacks?.size !== 0) {
      callbacks.add(cb);
    } else {
      this.listeners.set(key, new Set([cb]));
    }
  }

  unsubscribe(key: K, cb: (value: S[K]) => void) {
    this.listeners.get(key)?.delete(cb);
  }

  notify(key: K, v: S[K]) {
    this.listeners.get(key)?.forEach((cb) => cb(v));
  }
}
