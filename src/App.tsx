import { memo, useRef } from "react";
import {
  addTodo,
  Todo,
  useFilterValue,
  useTodos,
  deleteTodo as storeDeleteTodo,
  completeTodo as storeCompleteTodo,
} from "./store/todos";

const FilterInput = () => {
  console.log("TodoInput render");

  const [value, setValue] = useFilterValue();

  return (
    <input
      type="text"
      onChange={(e) => setValue(e.target.value)}
      value={value}
    />
  );
};

const NewTodoInput = () => {
  console.log("NewTodoInput render");

  const inputRef = useRef<HTMLInputElement>(null);

  const createTodo = () => {
    if (!inputRef.current) {
      throw Error("input error");
    }

    const value = inputRef.current.value;

    if (value.length < 5) {
      return window.alert("length must be more than 5");
    }

    inputRef.current.value = "";

    addTodo({ title: value, id: Math.random().toString(), completed: false });
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={createTodo}>add</button>
    </div>
  );
};

const TodoItem = memo(({ title, completed, id }: Todo) => {
  console.log(`NewTodoInput render ${id}`);

  const deleteTodo = () => storeDeleteTodo(id);

  const completeTodo = () => storeCompleteTodo(id);

  return (
    <li style={{ background: completed ? "green" : "yellow" }}>
      <p>{title}</p>
      {completed ? (
        <button type="button" onClick={deleteTodo}>
          delete
        </button>
      ) : (
        <button type="button" onClick={completeTodo}>
          complete
        </button>
      )}
    </li>
  );
});

const Todos = () => {
  console.log(`Todos render`);

  const [todos] = useTodos();
  const [filterValue] = useFilterValue();

  const filteredTodos = filterValue.length
    ? todos.filter((todo) =>
        todo.title.toLowerCase().includes(filterValue.toLowerCase())
      )
    : todos;

  return (
    <>
      <h5>total todos: {todos.length}</h5>
      <ul>
        {filteredTodos.map(({ id, completed, title }) => (
          <TodoItem key={id} id={id} completed={completed} title={title} />
        ))}
      </ul>
    </>
  );
};

const App = () => {
  return (
    <div className="App">
      <FilterInput />
      <br />
      <NewTodoInput />
      <br />
      <Todos />
    </div>
  );
};

export default App;
