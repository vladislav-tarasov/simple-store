import { PersistStore } from "../lib/store";
import { useSelector } from "../lib/store/hooks/use-selector";

export type Todo = { id: string; title: string; completed: boolean };

const todosStore = new PersistStore<{
  filterValue: string;
  todos: Todo[];
}>({
  storageKey: "todosStore",
  initialValues: () => ({ filterValue: "", todos: [] }),
});

// hooks
export const useFilterValue = () => useSelector(todosStore, "filterValue");

export const useTodos = () => useSelector(todosStore, "todos");

// actions
export const addTodo = (todo: Todo) =>
  todosStore.set(({ todos }) => ({
    filterValue: "",
    todos: [...todos, todo],
  }));

export const deleteTodo = (id: Todo["id"]) =>
  todosStore.setBy("todos", (todos) => todos.filter((todo) => todo.id !== id));

export const completeTodo = (id: Todo["id"]) =>
  todosStore.setBy("todos", (todos) =>
    todos.map((todo) => (todo.id === id ? { ...todo, completed: true } : todo))
  );
