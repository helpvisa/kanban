// declare variables
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");


// subscribe to event calls
formEl.addEventListener("submit", addTask);


// declare functions
function addTask(event) {
    // prevent default browser behaviour on form submission (stops refresh)
    event.preventDefault();

    // get the values of the task form
    var taskName = document.querySelector("input[name='task-name']").value;
    var taskType = document.querySelector("select[name='task-type']").value;

    // used to check if the user has inputted no letters / only spaces into the string, and throw an error to avoid a blank task
    var taskNameNoSpace = taskName.replace(/\s+/g, "");
    // \s = regex for whitespace, g = global flag (match all whitespaces), + = replace contiguous spaces at once

    // if no name entered, exit and throw error
    if (taskNameNoSpace === "" || taskName === null || taskName === undefined) {
        alert("Please enter a task name!");
        return;
    }
    else if (taskType === "" || taskType === undefined || taskType === null) {
        alert("Please choose a task type!")
        return;
    }
    else { // add task to the board
        var taskItemEl = document.createElement("li"); // create html li element
        taskItemEl.className = "task-item"; // give the item a styling class
        var taskInfoEl = document.createElement("div"); // create containing div
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskName + "</h3><span class='task-type'>" + taskType + "</span>"; // directly modify html
        taskItemEl.appendChild(taskInfoEl); // add this info to the task item as a child element
        tasksToDoEl.appendChild(taskItemEl); // append the task item to the ul element on the page
    }
}