 import React, { useEffect, useState } from "react";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [newTask, setNewTask] = useState("");
    const username = "b123"; // ✅ Your custom username

    // ✅ Create user (once) on component load
    useEffect(() => {
        const createUser = () => {
            return fetch(`https://playground.4geeks.com/todo/users/${username}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([]) // ✅ API requires empty array
            });
        };

        createUser()
            .then((res) => {
                if (!res.ok) throw new Error("User creation failed");
                return res.json();
            })
            .then((data) => {
                console.log("User created:", data);
                getAgenda();
            })
            .catch((error) => {
                console.warn("User may already exist:", error);
                getAgenda(); // still fetch tasks anyway
            });
    }, []);

    // ✅ Get all tasks for the user
    const getAgenda = () => {
        fetch(`https://playground.4geeks.com/todo/users/${username}`)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("Fetched:", data);
                setPosts(data.todos || []);
            })
            .catch((error) => console.error("Fetch failed:", error));
    };

    // ✅ Add a new task (using /todos/:username)
    const addTask = () => {
        if (newTask.trim() === "") return;

        const task = {
            label: newTask,
            is_done: false
        };

        fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        })
            .then((resp) => {
                console.log("Response OK?", resp.ok);
                console.log("Status:", resp.status);
                return resp.json();
            })
            .then((data) => {
                console.log("Created task:", data);
                setNewTask("");
                getAgenda();
            })
            .catch((error) => console.error("Add task failed:", error));
    };

    // ✅ Delete a task by ID
    const deleteTask = (taskId) => {
        fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
            method: "DELETE"
        })
            .then((resp) => resp.json())
            .then(() => getAgenda())
            .catch((error) => console.error("Delete failed:", error));
    };

    return (
        <div className="text-center">
            <h1>To-Do List</h1>

            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter new task"
            />
            <button onClick={addTask}>Add Task</button>

            {posts.length > 0 ? (
                posts.map((item, index) => (
                    <div key={item.id || index}>
                        {item.label}
                        <button onClick={() => deleteTask(item.id)}>x</button>
                    </div>
                ))
            ) : (
                <div>No tasks available</div>
            )}

            <button onClick={() => setPosts([])}>
                Clear All Tasks
            </button>
        </div>
    );
};

export default Home;
