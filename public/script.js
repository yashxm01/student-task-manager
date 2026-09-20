const API_URL = "/tasks";

async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();

        const tasksContainer = document.getElementById("tasks");

        if (tasks.length === 0) {
            tasksContainer.innerHTML = "<p>No tasks available.</p>";
            return;
        }

        tasksContainer.innerHTML = "";

        tasks.forEach(task => {
            const taskElement = document.createElement("div");

            taskElement.className = "task";

            taskElement.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description || "No description"}</p>
                <p>Due Date: ${task.dueDate || "Not set"}</p>
                <p class="status">Status: ${task.status}</p>

                <button onclick="completeTask(${task.id})">
                    Mark Completed
                </button>

                <button onclick="deleteTask(${task.id})">
                    Delete
                </button>
            `;

            tasksContainer.appendChild(taskElement);
        });

    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}


async function addTask() {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("dueDate").value;

    if (!title.trim()) {
        alert("Please enter a task title.");
        return;
    }

    try {

        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: title,
                description: description,
                dueDate: dueDate
            })
        });

        const data = await response.json();

        console.log(data);

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("dueDate").value = "";

        loadTasks();

    } catch (error) {
        console.error("Error adding task:", error);
    }
}


async function completeTask(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: "COMPLETED"
            })
        });

        const data = await response.json();

        console.log(data);

        loadTasks();

    } catch (error) {
        console.error("Error completing task:", error);
    }
}


async function deleteTask(id) {

    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        console.log(data);

        loadTasks();

    } catch (error) {
        console.error("Error deleting task:", error);
    }
}


loadTasks();