import React from "react";
import TodoItem from "./TodoItem";

const TodoBoard = ({ todoList, taskComplete, deleteTask }) => {
  const sortedTodoList = [...todoList].sort((a, b) => a.isComplete - b.isComplete);

  return (
    <div>
      {sortedTodoList.length > 0 ? (
        sortedTodoList.map((item, index) => (
          <TodoItem
            item={item}
            key={index}
            taskComplete={taskComplete}
            deleteTask={deleteTask}
          />
        ))
      ) : (
        <h2>Add new tasks!</h2>
      )}
    </div>
  );
};

export default TodoBoard;
