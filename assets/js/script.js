//** declare variables and query html elements
// form and tasks
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;
// page content
var pageEl = document.querySelector("#page-content");


//** subscribe to event calls
formEl.addEventListener("submit", processForm); // for form
pageEl.addEventListener("click", dynamicTaskHandler); // for page
pageEl.addEventListener("change", statusHandler); // for select elements on tasks


//** declare functions
function processForm(event) { // processes user's form input and sends it to the add task function
    // prevent default browser behaviour on form submission (stops refresh)
    event.preventDefault();

    // get the values of the task form
    var taskName = document.querySelector("input[name='task-name']").value;
    var taskType = document.querySelector("select[name='task-type']").value;

    // used to check if the user has inputted no letters / only spaces into the string, and throw an error to avoid a blank task
    var taskNameNoSpace = taskName.replace(/\s+/g, "");
    // \s = regex for whitespace, g = global flag (match all whitespaces), + = replace contiguous spaces at once

    // if no name or task type entered, exit and throw error
    if (taskNameNoSpace === "" || taskName === null || taskName === undefined) {
        alert("Please enter a task name!");
        return;
    }
    else if (taskType === "" || taskType === undefined || taskType === null) {
        alert("Please choose a task type!")
        return;
    }
    else {
        var editing = formEl.hasAttribute("data-task-id");
        if (editing) { // update task by id and clear id attribute
            var id = formEl.getAttribute("data-task-id"); // fetch the task id
            var taskObject = {name: taskName, type: taskType, id: id}; // submit task object
            completeEditTask(taskObject); // complete editing job
        }
        else { // create new task
            var taskObject = { name: taskName, type: taskType, id: taskIdCounter }; // create an object which contains the task information
            taskIdCounter++; // increment the task id counter;
            formEl.reset();
            addTask(taskObject); // return this object
        }
    }
}

function addTask(task) { // adds task to board
    // add task to the board
    var taskItemEl = document.createElement("li"); // create html li element
    taskItemEl.className = "task-item"; // give the item a styling class
    taskItemEl.setAttribute("data-task-id", task.id); // assign a unique data-type id;
    var taskInfoEl = document.createElement("div"); // create containing div
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + task.name + "</h3><span class='task-type'>" + task.type + "</span>"; // directly modify html
    taskItemEl.appendChild(taskInfoEl); // add this info to the task item as a child element
    taskItemEl.appendChild(createTaskActions(task.id));
    tasksToDoEl.appendChild(taskItemEl); // append the task item to the ul element on the page
}

function createTaskActions(id) { // creates dynamic elements on the given task
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", id);
    actionContainerEl.appendChild(editButtonEl); // add button to task

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn"
    deleteButtonEl.setAttribute("data-task-id", id);
    actionContainerEl.appendChild(deleteButtonEl); // add button to task

    // create dropdown menu
    var dropdownEl = document.createElement("select");
    dropdownEl.className = "select-status";
    dropdownEl.setAttribute("name", "status-change");
    dropdownEl.setAttribute("data-task-id", id);
    var options = ["To Do", "In Progress", "Completed"]; // array of selectable options; they will be added in order

    for (var i = 0; i < options.length; i++) { // loop thru status choices and add to dropdown element
        //create option element
        var optionEl = document.createElement("option");
        optionEl.textContent = options[i];
        optionEl.setAttribute("value", options[i]);
        dropdownEl.appendChild(optionEl); // add option to dropdown
    }

    actionContainerEl.appendChild(dropdownEl); // add dropdown to task

    return actionContainerEl; // return the created element
}

function dynamicTaskHandler(event) { // handles manipulation of the button elements dynamically added to the tasks
    if (event.target.matches(".edit-btn")) {
        var id = event.target.getAttribute("data-task-id"); // get id of task this button is attached to
        beginEditTask(id); // edit it
    }
    else if (event.target.matches(".delete-btn")) {
        var id = event.target.getAttribute("data-task-id"); // get id of task this button is attached to
        deleteTask(id); // balete it
    }
}

function statusHandler(event) { // move tasks around based on their status
    var id = event.target.getAttribute("data-task-id"); // fetch task id
    var status = event.target.value.toLowerCase(); // fetch the task status and convert to lowercase for easier parsing
    var task = getTask(id); // fetch the task proper

    if (status === "to do") {
        tasksToDoEl.appendChild(task);
    }
    else if (status === "in progress") {
        tasksInProgressEl.appendChild(task);
    }
    else if (status === "completed") {
        tasksCompletedEl.appendChild(task);
    }
}

function beginEditTask(id) { // edits existing task with specified id
    var task = getTask(id); // query task by id
    var taskName = task.querySelector("h3.task-name").textContent; // fetch its name
    var taskType = task.querySelector("span.task-type").textContent; // fetch its type

    // update form entry to enable editing mode
    document.querySelector("input[name='task-name']").value = taskName; // update form name
    document.querySelector("select[name='task-type']").value = taskType; // update form type
    document.querySelector("#save-task").textContent = "Update Task"; // update submit button to reflect editing mode
    formEl.setAttribute("data-task-id", id); // assign the currently edited task's id to the form to read at resubmission
}

function completeEditTask(task) { // commits changes to edited task
    var editTask = getTask(task.id); // query task by id

    // set new task values
    editTask.querySelector("h3.task-name").textContent = task.name;
    editTask.querySelector("span.task-type").textContent = task.type;

    document.querySelector("input[name='task-name']").placeholder = "Task Updated!"; // inform user they were succesful
    document.querySelector("#save-task").textContent = "Add Task"; // revert button to original text
    formEl.removeAttribute("data-task-id"); // remove id attribute to restore add-task functionality
    formEl.reset();
    setTimeout(function() { // restore original text after 1 second
        document.querySelector("input[name='task-name']").placeholder = "Enter Task Name";
    }, 2000);
}

function deleteTask(id) { // what do you think? (deletes task with specified id)
    task = getTask(id);
    task.remove(); // thelete it
}

function getTask(id) { // fetch task by id and return it
    var task = document.querySelector(".task-item[data-task-id='" + id + "']"); // query task by id
    return task;
}