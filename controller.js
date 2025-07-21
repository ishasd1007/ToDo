// glue b/w view and model / service
import { validateName } from "./validation.js"; 
import todoOperations from "./service.js";
import { init } from "./util.js";
console.log("controller.js loaded");
window.addEventListener('load', initialize);
let autoId ; 
function initialize(){
     console.log(" initialize called");
    bindEvents();
    autoId = init();
    showId();
   
}



function bindEvents(){
     console.log("📌 bindEvents called");
document.getElementById('add').addEventListener('click', addTask);
document.querySelector('#delete').addEventListener('click', deleteForEver);
document.querySelector('#Save').addEventListener('click',Save);
document.querySelector('#load').addEventListener('click',load);
document.querySelector('#update').addEventListener('click',update);
document.querySelector('#clear-all').addEventListener('click',clearAll);
}
function clearAll(){
    document.querySelector('#task-list').innerHTML = '';
    todoOperations.clearAllTasks();
    updateCounts();
    localStorage.removeItem('tasks');
}
function updateCounts() {
    document.querySelector('#total').innerText = taskOperations.tasks.length;
    const marked = taskOperations.tasks.filter(task => task.isMarked).length;
    document.querySelector('#marked').innerText = marked;
    document.querySelector('#unmarked').innerText = taskOperations.tasks.length - marked;
}





function update() {
    const updatedTask = readFields();  

    const existingTask = todoOperations.searchTask(updatedTask.id); 

    if (existingTask) {
        for (let field of FIELDS) {
            if (field !== 'id') {
                existingTask[field] = updatedTask[field];  
            }
        }

        const tbody = document.querySelector('#task-list');
        tbody.innerHTML = '';  
        printAllTask();        
        clearFields();         
        computeTotal();        
    }
}

function Save(){
    if(window.localStorage){
 const tasks = todoOperations.getTasks();
 localStorage.tasks = JSON.stringify(tasks);
 alert("Data Store....");
    }
    else{
        alert("Outdated Browser No Support of localstorage...")
    }

}
function load(){
if(window.localStorage){
if(localStorage.tasks){
    const tasks = JSON.parse(localStorage.tasks);
 const tbody = document.querySelector('#task-list');
            tbody.innerHTML = '';
            todoOperations.tasks = tasks;

            tasks.forEach(task => {
                printTask(task);
            });
computeTotal();
}
else{
    alert("No data to Load...");
}
}
else{
     alert("Outdated Browser No Support of localstorage...")
}

}

function deleteForEver(){
    const tbody = document.querySelector('#task-list');
    tbody.innerHTML = '';
    todoOperations.removeTask();
    printAllTask();
}
function showId(){
    document.querySelector('#id').innerText = autoId();
}



function addTask(){
    var task = readFields();
    if(verifyFields(task)){
        todoOperations.addTask(task);
        deleteForEver(task);
        computeTotal();
        showId();
        clearFields();
        console.log("✅ addTask clicked");
        
    }

    //console.log('Task is ', task);

}

function printAllTask(){
    // todoOperations.tasks.forEach(function(task){
    //     printTask(task);
    // });
     todoOperations.tasks.forEach(printTask);
     computeTotal();
}

function printTask(task){
    const tbody = document.querySelector('#task-list');
   // const str = `<tr> <td>`;
   const tr = tbody.insertRow();
  
   let index = 0;
    
   for(let key in task){
   
        if(key == 'isMarked'){
            continue;
        }
         const td = tr.insertCell(index);
        if(key == 'photo'){
            td.appendChild(createImage(task[key]));
        
        }else{
            td.innerText = task[key];
        }
       
        index++;
   }
   const td = tr.insertCell(index);
   td.appendChild(createIcon(task.id, toggleMarking));
   td.appendChild(createIcon(task.id, edit, 'fa-pen'));

}

function computeTotal(){
    document.querySelector('#total').innerText = todoOperations.getTotal();
    document.querySelector('#marked').innerText = todoOperations.markCount();
    document.querySelector('#unmarked').innerText = todoOperations.unmarkCount();
}

function toggleMarking(){
    const currentButton  = this;
    const id = currentButton.getAttribute('task-id');
    console.log('Toggle Marking Call ', id);
    todoOperations.toggleTask(id);
    console.log('All Task ', todoOperations.tasks);
    const tr = currentButton.parentNode.parentNode;
    tr.classList.toggle('red');
    computeTotal();

}
 let task;
function edit() {
    const icon = this;
    const taskId = icon.getAttribute('task-id');
     task = todoOperations.searchTask(taskId);

    if (task) {
        for (let key of FIELDS) {
            if (key === 'isMarked') continue;
            
            if (key === 'id') {
                document.querySelector('#id').innerText = task[key];
            } else {
                const element = document.querySelector(`#${key}`);
                if (element) {
                    element.value = task[key];
                }
            }
        }
    }

    // Also clear error if any (optional)
    document.getElementById('name-error').innerText = '';
}



            
            

        
function createImage(url){
    const imageTag = document.createElement('img');
    imageTag.src = url;
    imageTag.alt = 'Task Photo';
    imageTag.className = 'size';
    return imageTag;
}

function createIcon(id, fn, className='fa-trash'){
    // <i class="fa-solid fa-trash"></i>
    const iTag = document.createElement('i');
    iTag.className = `fa-solid ${className} hand`;
    iTag.addEventListener('click', fn);
    iTag.setAttribute('task-id', id);
    return iTag;
}

function verifyFields(task){
    var errorMessage = "";
    errorMessage = validateName(task.name);
    if(errorMessage){
    document.getElementById('name-error').innerText  = errorMessage;
    return false;
    }
   
        return true;
}
        function clearFields(){
            for(let field of FIELDS){
                if(field === 'id'){
                    continue
                }
                
                document.querySelector(`#${field}`).value = '';
            }
            document.querySelector('#id').focus();
             document.getElementById('name-error').innerText = '';

        }

const FIELDS = ['id', 'name', 'desc' , 'date','time','photo'];

function readFields(){
    // read the fields
    // var id = document.getElementById('id').value;
    // var name = document.getElementById('name').value;
   // const FIELDS = ['id', 'name', 'desc' , 'date','time','photo'];
    var task = {};
    for(let field of FIELDS){
        if(field=='id'){
             task[field] = document.getElementById(field).innerText;
             continue;
        }
        task[field] = document.getElementById(field).value;
    }
    return task;
}
