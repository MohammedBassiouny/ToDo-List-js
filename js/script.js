// Difine variables
const input = document.querySelector(".input");
const submit = document.querySelector(".submit");
const Tasks = document.querySelector(".tasks ul");
const DelAll = document.querySelector(".del-all")

console.log(input.value)
// array of Tasks
let arrayOfTasks = [];
// create store in local storge to save Data comes From arrayOfTasks
if (localStorage.getItem("tasks")){
    arrayOfTasks = JSON.parse(localStorage.getItem("tasks"))
}

// alert Design and Function
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.style.position = 'fixed';
    alert.style.top = '50%';
    alert.style.left = '50%';
    alert.style.transform = "translate(-50%, -50%)";
    alert.style.zIndex = '10';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alert);
//function to remove alert after 1.5sec
    setTimeout(() => {
        alert.remove();
    }, 1500);
}



function hello (){
    if(Tasks.innerHTML == "" ||!localStorage.getItem("tasks")){
        const li = document.createElement("li");
        li.className = "hello"
        li.appendChild(document.createTextNode("Hello!Your Tasks Will Be Displayed Here"));
        Tasks.appendChild(li)
    }
}

getTasksFromLocalStorge();


submit.onclick = function () {
    if(input.value !==""){
        addTaskToArray(input.value); // function to add tasks
        input.value = "";           // empty input value after submite
    }
}

// Delete All Taskes
DelAll.onclick = function(){
    localStorage.removeItem("tasks");
    Tasks.innerHTML = "";
    hello();
    localStorage.removeItem("tasks");
    showAlert('All Tasks Remove Successfully', 'danger');
}
// Main Function which control in adding Tasks how it will happen?!!!!!!
Tasks.addEventListener("click", (e)=>{
    if(e.target.classList.contains('del')){
        e.target.parentElement.remove();
        removeTaskFromLocalStorge(e.target.parentElement.getAttribute("data-id"));
        hello();
    }
    
    
    if (e.target.classList.contains("edit")) {
        let taskId = e.target.parentElement.getAttribute("data-id");
        let taskElement = e.target.parentElement;
        let inputEdit = document.createElement("input");
        inputEdit.type = "text";
        inputEdit.value = taskElement.firstChild.textContent;
        taskElement.firstChild.remove(); 
        taskElement.prepend(inputEdit); 

        let saveBtn = document.createElement("button");
        saveBtn.appendChild(document.createTextNode("Save"));
        saveBtn.className = "save";
        e.target.replaceWith(saveBtn); 

        saveBtn.addEventListener("click", () => {
            let newText = inputEdit.value.trim();
            if (newText !== "") {
                taskElement.prepend(document.createTextNode(newText));
                inputEdit.remove();
                updateTaskText(taskId, newText);
                saveBtn.replaceWith(e.target);
            }
        });
    }

    if (e.target.classList.contains('task')){
        e.target.classList.toggle("done");
        toggleStatus(e.target.getAttribute("data-id"));
    }
})
// function to addTaskToArray
function addTaskToArray(taskText){
    let task = {
        id : Date.now(),
        title : taskText ,
        completed : false
    };
    arrayOfTasks.push(task)  // push task to array
    // console.log(arrayOfTasks)
    addTasksToPage(arrayOfTasks)  // function to add tasks to page
    addTasksToLocalStorge(arrayOfTasks) // function to add tasks to LocalStorge
    showAlert('Successfully Adding', 'success'); 
}  
// function to add Elements to Html
function addTasksToPage(arrayOfTasks){
    Tasks.innerHTML = "";
    arrayOfTasks.forEach(task => {
        let li = document.createElement("li")
        li.className = "task";
        if(task.completed){
            li.className = "task done";
        }
        li.setAttribute("data-id",task.id)
        li.appendChild(document.createTextNode(task.title));
        let editBtn = document.createElement("span");
        editBtn.className = "edit";
        editBtn.appendChild(document.createTextNode("Update"));
        li.appendChild(editBtn);
        let span = document.createElement("span");
        span.className = "del";
        span.appendChild(document.createTextNode("Delete"));
        li.appendChild(span)
        Tasks.appendChild(li)
    });
}
// function to add Tasks To LocalStorge
function addTasksToLocalStorge(arrayOfTasks){
    window.localStorage.setItem("tasks",JSON.stringify(arrayOfTasks))
}

function getTasksFromLocalStorge(){
    let data = localStorage.getItem("tasks")
    if (data){
        let tasks = JSON.parse(data)
        addTasksToPage(tasks);
    }
}
// function to Remove Tasks To LocalStorge
function removeTaskFromLocalStorge(taskId){
    arrayOfTasks = arrayOfTasks.filter(task => task.id != taskId);
    addTasksToLocalStorge(arrayOfTasks);
    showAlert('Successfully Deleting ', 'danger');
}
//function to toggle Status
function toggleStatus(taskId){
    for(let i=0 ; i < arrayOfTasks.length ; i++){
        if(arrayOfTasks[i].id == taskId){
            arrayOfTasks[i].completed == false ? (arrayOfTasks[i].completed = true) : (arrayOfTasks[i].completed = false)
        }
    }
    addTasksToLocalStorge(arrayOfTasks);
    showAlert('status are exchanged', 'primary');
}
//function to update Task
function updateTaskText(taskId, newText) {
    for (let i = 0; i < arrayOfTasks.length; i++) {
        if (arrayOfTasks[i].id == taskId) {
            arrayOfTasks[i].title = newText; 
        }
    }
    addTasksToLocalStorge(arrayOfTasks); 
    showAlert('Successfully Updating', 'info');
}

window.onload = hello();