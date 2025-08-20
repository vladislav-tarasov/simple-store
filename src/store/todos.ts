import { LocalStorageState } from "../lib/store";
import { useStateObserverBy } from "../lib/store/hooks/use-state-observer";

export type Todo = { id: string; title: string; completed: boolean };

const todosState = new LocalStorageState<{
  filterValue: string;
  todos: Todo[];
}>("todosState", { filterValue: "", todos: [] });

// hooks
export const useFilterValue = () =>
  useStateObserverBy(todosState, "filterValue");

export const useTodos = () => useStateObserverBy(todosState, "todos");

// actions
export const addTodo = (todo: Todo) =>
  todosState.set({
    filterValue: "",
    todos: todosState.getBy("todos").concat(todo),
  });

export const deleteTodo = (id: Todo["id"]) =>
  todosState.setBy(
    "todos",
    todosState.getBy("todos").filter((todo) => todo.id !== id)
  );

export const completeTodo = (id: Todo["id"]) =>
  todosState.setBy(
    "todos",
    todosState
      .getBy("todos")
      .map((todo) => (todo.id === id ? { ...todo, completed: true } : todo))
  );
