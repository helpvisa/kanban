// declare variables
var buttonEl = document.querySelector("#save-task");
var tasksToDoEl = document.querySelector("#tasks-to-do");

// subscribe to event calls
buttonEl.addEventListener("click", addTask);


// declare functions
function addTask() {
    var taskItemEl = document.createElement("li");
    taskItemEl.textContent = "new item";
    taskItemEl.className = "task-item";
    tasksToDoEl.appendChild(taskItemEl);
}