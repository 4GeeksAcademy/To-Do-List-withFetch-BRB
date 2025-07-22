import React, { useEffect, useState } from "react";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [newTask, setNewTask] = useState("");

    const username = "b123"; // ✅ Your chosen username

    // ✅ Create user once when app loads
    useEffect(() => {
        const createUser = () => {
            return fetch(`https://playground.4geeks.com/todo/users/${username}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([]) // ✅ REQUIRED by API
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
                getAgenda(); // still try to fetch tasks
            });
    }, []);

    // ✅ Fetch tasks
    const getAgenda = () => {
        fetch(`https://playground.4geeks.com/todo/users/${username}`)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("Fetched:", data);
                setPosts(data.todos || []);
            })
            .catch((error) => console.error("Fetch failed:", error));
    };

    // ✅ Add a new task
    const addTask = () => {
        if (newTask.trim() === "") return;

        fetch("https://playground.4geeks.com/todo/todos", { // ✅ Correct endpoint
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                label: newTask,
                is_done: false,
                user: username
            })
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("Add task response:", data);
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
                        <button onClick={() => deleteTask(item.id)}>❌</button>
                    </div>
                ))
            ) : (
                <div>No tasks available</div>
            )}

            <button onClick={() => setPosts([])}>
                Clear All Tasks (Local Only)
            </button>
        </div>
    );
};

export default Home;
