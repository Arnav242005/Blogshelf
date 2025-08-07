import React, { useContext, useState,useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import "../alltasks.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function AllTasks() {
  const initialTasks = useLoaderData();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const { state } = useContext(AuthContext);
  const loggedInUsername = state?.user?.username;
  const userTasks = initialTasks.filter(
    (task) => task.user === loggedInUsername
  );
  const [tasks, setTasks] = useState(userTasks);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const startEdit = (task) => {
    setEditingTaskId(task.id);
    reset({
      id: task.id,
      title: task.title,
      description: task.description,
      date: task.date,
    });
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    reset();
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://688f6c68f21ab1769f8927ce.mockapi.io/tasks/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      } else {
        alert("Failed to delete task from server.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("An error occurred while deleting the task.");
    }
  };

  useEffect(() => {
    const expirationDays = 2;
    const now = new Date();

    userTasks.forEach(async (task) => {
      const taskDate = new Date(task.date);
      const diffDays = Math.floor((now - taskDate) / (1000 * 60 * 60 * 24));

      if (diffDays > expirationDays) {
        try {
          await fetch(`https://688f6c68f21ab1769f8927ce.mockapi.io/tasks/${task.id}`, {
            method: "DELETE",
          });
          setTasks((prev) => prev.filter((t) => t.id !== task.id));
        } catch (error) {
          console.error(`Failed to auto-delete expired task ${task.id}:`, error);
        }
      }
    });
  }, [userTasks]);

  const onSubmit = async (data) => {
    try {
      const updatedTask = {
        ...data,
        date: new Date().toLocaleDateString(),
        user: loggedInUsername,
      };
      console.log("Editing task ID:", editingTaskId);
      console.log("Updated data:", updatedTask);
      console.log(
        "All task IDs:",
        tasks.map((t) => t.id)
      );
      const response = await axios.put(
        `https://688f6c68f21ab1769f8927ce.mockapi.io/tasks/${data.id}`,
        data
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                title: response.data.title,
                description: response.data.description,
                date: response.data.date,
              }
            : task
        )
      );

      setEditingTaskId(null);
      reset();
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  return (
    <div className="maindiv">
      <h2>Welcome, {state.user.username}</h2>
      <div className="taskcardcomp">
        {tasks.length === 0 ? (
          <div className="notasks">
            <h3 className="notaskh3">No Task Found for your Account</h3>
            <Link to={"/taskform"} className="add-task-link">
              Click to add task
            </Link>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="taskcards">
              <p className="datep">{task.date}</p>

              {editingTaskId === task.id ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input type="hidden" {...register("id")} />
                  <input
                    {...register("title", { required: true })}
                    placeholder="Title"
                    className="edit-input"
                  />
                  {errors.title && (
                    <span className="error">Title is required</span>
                  )}

                  <textarea
                    {...register("description")}
                    placeholder="Description"
                    className="edit-input"
                  />

                  <div className="buttonspan">
                    <button type="submit" className="save-button" title="Save">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="cancel-button"
                      title="Cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="titlep">{task.title}</p>
                  <p className="descp">{task.description}</p>
                  <div className="buttonspan">
                    <button
                      onClick={() => startEdit(task)}
                      className="icon-button"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536M9 11l6-6 3.536 3.536-6 6H9v-3z"
                        />
                      </svg>
                    </button>

                    <button
                      className="icon-button"
                      title="Delete"
                      onClick={() => handleDelete(task.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AllTasks;
