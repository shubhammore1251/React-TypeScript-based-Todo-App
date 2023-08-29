import React, { useEffect, useState } from 'react';
import './App.css';
import InputField from './components/InputField';
import { Todo } from './model';
import { v4 as uuidv4 } from 'uuid';
import TodoList from './components/TodoList';
import {DragDropContext, DropResult} from 'react-beautiful-dnd';

const App: React.FC = () => {

  const [todo, setTodo] = useState<string>("");

  const [todos, setTodos] = useState<Todo[]>([]);
  
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([])


  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("TODOs") || "[]");

    const completedSavedTodos = JSON.parse(localStorage.getItem("CompletedTodos") || "[]");

    setTodos(savedTodos);

    setCompletedTodos(completedSavedTodos);
  }, []);
  

  useEffect(() => {
    localStorage.setItem("TODOs", JSON.stringify(todos));
  }, [todos])

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (todo) {
      setTodos([...todos, { id: uuidv4(), todo}]);
      setTodo("");
    }
  }

  const onDragEnd = (result: DropResult) => {
    
    const { source, destination } = result;
    
    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index ) return;

    let add;
    let active = todos;
    let complete = completedTodos;

    // Source Logic
    if (source.droppableId === "TodosList") {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
    }

    // Destination Logic
    if (destination.droppableId === "TodosList") {
      active.splice(destination.index, 0, add);
    } else {
      complete.splice(destination.index, 0, add);
    }

    setCompletedTodos(complete);
    setTodos(active);

    localStorage.setItem("TODOs", JSON.stringify(active));

    localStorage.setItem("CompletedTodos", JSON.stringify(complete));

  }


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <span className='heading'>TO DO</span>

        <InputField todo={todo} setTodo={setTodo} handleAddTodo={handleAddTodo}/>

        <TodoList todos={todos} setTodos={setTodos}  completedTodos={completedTodos} setCompletedTodos={setCompletedTodos}/>
      </div>
    </DragDropContext>
  );
}

export default App;
