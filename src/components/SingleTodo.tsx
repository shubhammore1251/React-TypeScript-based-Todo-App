import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { Todo } from "../model";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Draggable } from "react-beautiful-dnd";

type Props = {
  index: number;
  todo: Todo;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  taskComplete: boolean;
};

const SingleTodo: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  index,
  taskComplete,
}) => {
  const [edit, setEdit] = useState<boolean>(false);

  const [editTodoText, setEditTodoText] = useState<string>(todo.todo);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);


  const handleDelete = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));

    const storageKey = taskComplete ? "CompletedTodos" : "TODOs";
    const storedTodos = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const updatedTodos = storedTodos.filter((todo: Todo) => todo.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(updatedTodos));
  };

  const handleEditSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, todo: editTodoText } : todo
      )
    );
    setEdit(false);
  };

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided, snapshot) => (
        <form
          className={`single-todo ${snapshot.isDragging ? "drag" : ""}`}
          onSubmit={(e) => handleEditSubmit(e, todo.id)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {edit ? (
            <input
              value={editTodoText}
              ref={inputRef}
              onChange={(e) => setEditTodoText(e.target.value)}
              className="single-todo-input"
            />
          ) : taskComplete ? (
            
              <s style={{color: "#fff"}}>
               <span className="todo-title">{todo.todo}</span> 
              </s>
          ) : (
            <span className="todo-title">{todo.todo.length>35? `${todo.todo.slice(0,35)}...` : todo.todo }</span>
          )}

          <div>
            {taskComplete ? null : (
              <>
                <span
                  className="icon"
                  onClick={() => {
                    if (!edit && !taskComplete) {
                      setEdit(!edit);
                    }
                  }}
                >
                  <AiFillEdit />
                </span>
              </>
            )}

            <span className="icon" onClick={() => handleDelete(todo.id)}>
              <AiFillDelete />
            </span>
          </div>
        </form>
      )}
    </Draggable>
  );
};

export default SingleTodo;
