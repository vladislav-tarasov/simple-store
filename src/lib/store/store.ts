import { EventManager } from "./utils/event-manager";
import { DefaultStoreValues } from "./types";

export class Store<V extends DefaultStoreValues> {
  private store: V;
  private eventManager: EventManager<V>;

  constructor(initialValues: () => V) {
    const self = this;

    this.store = new Proxy(initialValues(), {
      set(obj: V, key: string, value: V[keyof V]) {
        obj[key as keyof V] = value;

        self.eventManager.notify(key, value);

        return true;
      },
    });

    this.eventManager = new EventManager();
  }

  getBy<K extends keyof V>(key: K): V[K] {
    return this.store[key];
  }

  get(): V {
    return this.store;
  }

  setBy<K extends keyof V>(key: K, nextValue: (prevValue: V[K]) => V[K]) {
    this.store[key] = nextValue(this.store[key]);
  }

  set(nextValue: (prevValues: V) => Partial<V>) {
    Object.entries(nextValue(this.store)).forEach(([key, value]) => {
      this.store[key as keyof V] = value;
    });
  }

  watchBy(key: keyof V, cb: (value: V[keyof V]) => void) {
    this.eventManager.subscribe(key, cb);

    return () => this.eventManager.unsubscribe(key, cb);
  }
}
