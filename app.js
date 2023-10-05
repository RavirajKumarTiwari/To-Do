// DOM Elements

const todoForm = document.querySelector("#todo-form");
const todoList = document.querySelector(".todos");
const totalTasks = document.querySelector("#total-tasks");
const completedTasks = document.querySelector("#completed-tasks");
const remainingTasks = document.querySelector("#reamaining-tasks");
const mainInput = document.querySelector("#todo-form input");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (localStorage.getItem("tasks")) {
    tasks.map((task) => {
        createTask(task);
    });
}

// if (localStorage.getItem("tasks")) {
//     tasks.map((task) => {
//         createTask(task);
//     });
// }

// submit form
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = mainInput.value;

    if (inputValue == "") {
        return;
    }

    const task = {
        id: new Date().getTime(),
        name: inputValue,
        isCompleted: false,
    };

    //save that task into local storage of browser
    tasks.push(task); // push each task obj into tasks array
    // local storage only supports strings so we need to convert tasks array into string
    localStorage.setItem("tasks", JSON.stringify(tasks));

    createTask(task);

    todoForm.reset();
    mainInput.focus();
});

// For removing the task
todoList.addEventListener("click", (e) => {
/* This code block is checking if the clicked element or its parent elements contain the class
"remove-task". If any of them do, it means that the user clicked on the remove task button. */
    if (
        e.target.classList.contains("remove-task") ||
        e.target.parentElement.classList.contains("remove-task") ||
        e.target.parentElement.parentElement.classList.contains("remove-task")
    ) {
        const taskId = e.target.closest("li").id;

        removeTask(taskId);
    }
});

// While editing the task if you click enter then it will be saved and remove focus
todoList.addEventListener("keydown", (e) => {
    if (e.keyCode === 13 || e.keyCode === 9) {
        e.preventDefault();
        e.target.blur(); // remove focus
    }
})

// For updating the task
todoList.addEventListener("input", (e) => {
    const taskId = e.target.closest("li").id;
    updateTask(taskId, e.target);
});

function createTask(task) {
    const taskEl = document.createElement("li");

    taskEl.setAttribute("id", task.id);

    if (task.isCompleted) {
        taskEl.classList.add("complete");
    }

    const taskElMarkup = `
        <div>
            <input type="checkbox" name="tasks" id="${task.id}" ${
        task.isCompleted ? "checked" : ""
    }>
            <span ${!task.isCompleted ? "contenteditable" : ""}>${
        task.name
    }</span>
        </div>
        <button title="Remove the "${task.name}" task" class="remove-task">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 16 16">
                <path d="M 2.75 2.042969 L 2.042969 2.75 L 2.398438 3.101563 L 7.292969 8 L 2.042969 13.25 L 2.75 13.957031 L 8 8.707031 L 12.894531 13.605469 L 13.25 13.957031 L 13.957031 13.25 L 13.605469 12.894531 L 8.707031 8 L 13.957031 2.75 L 13.25 2.042969 L 8 7.292969 L 3.101563 2.398438 Z"></path>
            </svg>
        </button>
    `;

    taskEl.innerHTML = taskElMarkup;

    todoList.appendChild(taskEl);

    countTasks();
}

function countTasks() {
    const completedTasksArray = tasks.filter(
        (task) => task.isCompleted === true
    );

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completedTasksArray.length;
    remainingTasks.textContent = tasks.length - completedTasksArray.length;
}

function removeTask(taskId) {
    tasks = tasks.filter((task) => task.id !== parseInt(taskId));

    // Remove the task from the page or DOM
    document.getElementById(taskId).remove();

    // Update the local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Recount the tasks
    countTasks();
}

function updateTask(taskId, el) {
    const task = tasks.find((task) => task.id === parseInt(taskId));

    if (el.hasAttribute("contenteditable")) {
        task.name = el.textContent;
    } else {
        const span = el.nextElementSibling;
        const parent = el.closest("li");

        task.isCompleted = !task.isCompleted;
        if (task.isCompleted) {
            span.removeAttribute("contenteditable");
            parent.classList.add("complete");
        }
        else {
            span.setAttribute("contenteditable", "true");
            parent.classList.remove("complete");
        }
    }

    // Update the local storage and also update count on the page
    localStorage.setItem("tasks", JSON.stringify(tasks));
    countTasks();
}

// Dark mode
function darkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}
