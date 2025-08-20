import { EventManager } from "./utils/event-manager";
import { DefaultState } from "./types";

export class State<S extends DefaultState> {
  private state: S;
  private eventManager: EventManager<S>;

  constructor(initialState: S | (() => S)) {
    this.state =
      typeof initialState === "function" ? initialState() : { ...initialState };

    this.eventManager = new EventManager();
  }

  getBy<K extends keyof S>(key: K): S[K] {
    return this.state[key];
  }

  get(): S {
    return this.state;
  }

  setBy<K extends keyof S>(key: K, value: S[K]) {
    this.state[key] = value;

    this.eventManager.notify(key, value);
  }

  set<K extends keyof S>(partialState: Partial<S>) {
    this.state = { ...this.state, ...partialState };

    Object.keys(partialState).forEach((key) =>
      this.eventManager.notify(key, this.state[key as K])
    );
  }

  watchBy<K extends keyof S>(key: K, cb: (value: S[keyof S]) => void) {
    this.eventManager.subscribe(key, cb);

    return () => this.eventManager.unsubscribe(key, cb);
  }
}
