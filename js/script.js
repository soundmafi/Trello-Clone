let taskBase = [{
    id: 1,
    category: 'todo',
    title: 'Делать дела',
    description:'Создать таск',
    user: 'Вася',
    date: '20.01.2000'
},
{
    id: 2,
    category: 'todo',
    title: 'Делать дела',
    description:'Создать таск',
    user: 'коля',
    date: '19.05.1654'
},

{
    id: 3,
    category: 'progress',
    title: 'Делать дела',
    description:'Создать таск',
    user: 'Настя',
    date: '22.25.4567'
}];

let taskInfo = {
    id: 1,
    category: 'todo',
    title: 'Делать дела',
    description:'Создать таск',
    user: 'Вася',
    date: '20.01.2000'
};

//button Add Task
let btnAddTask = document.querySelector('.button__add');
btnAddTask.addEventListener('click',e =>{
    let taskform = document.querySelector('.taskForm');
    taskform.classList.toggle('visible');
});

//button Delete All
let btnDeleteAll = document.querySelector('.button__deleteAll');
btnDeleteAll.addEventListener('click',e =>{
    let warning = document.querySelector('.warning');
    warning.classList.toggle('visible');
});

//button Warning Cancel & Confirm
let warning = document.querySelector('.warning');
warning.addEventListener('click', event=>{
    let eventTouch = event.target.className;

    if (eventTouch === 'warning__cancel'){
        warning.classList.toggle('visible');
    }
    if (eventTouch === 'warning__confirm'){
        console.log('confirm');
    }
});

// button taskForm -> cancel, confirm and select
let taskForm = document.querySelector('.taskForm');
taskForm.addEventListener('click', event =>{
    let eventTouch = event.target.className;
    
    if (eventTouch === 'taskForm__cancel'){
        taskForm.classList.toggle('visible');
    }
    if (eventTouch === 'taskForm__confirm'){
        console.log('операция подтверждение');
    }
    if (eventTouch === 'taskForm__user'){
        console.log('операция выбора юзера');
    }
});

//button task -> edit, delete, start, complete, back, 
let task = document.querySelectorAll('.task');
task.forEach(el =>{
    el.addEventListener('click', event =>{
        let eventTouch = event.target.className;
        if (eventTouch === 'button__edit'){
            console.log('редактировать таск');
        }
        if (eventTouch === 'button__delete'){
            console.log('удалить таск');
        }
        if (eventTouch === 'task__start'){
            console.log('начать таск');    
        }
        if (eventTouch === 'button__back'){
            console.log('вернуть такс обратно');
        }
        if (eventTouch === 'button__complete'){
            console.log('завершить таск');    
        }
});
});



// TaskRender
function newTaskRender(el,i){
let groundElement = elementBuilder('div','task');
groundElement.id =(i+1);
let taskTitle =  elementBuilder('div','task__title',el.title);
let taskDescription = elementBuilder('div','task__description',el.description);
let taskUser = elementBuilder('div','task__user',el.user);
let taskData = elementBuilder('div','task__data', el.date);
groundElement.appendChild(taskTitle);
groundElement.appendChild(taskDescription);
groundElement.appendChild(taskUser);
groundElement.appendChild(taskData);
groundElement.appendChild(elementBuilder('button','task__start','start'));
groundElement.appendChild(elementBuilder('button','button__edit','edit'));
groundElement.appendChild(elementBuilder('button','button__delete', 'delete'));
return groundElement ;
}


// render list of tasks
function renderList(allTasks){
    let listTodo = document.querySelector('.todo').querySelector('.task__list');
    let listProgress = document.querySelector('.progress').querySelector('.task__list');
    let listDone = document.querySelector('.done').querySelector('.task__list');
allTasks.forEach((el,i)=>{
    if (el.category === 'todo'){
        listTodo.appendChild(newTaskRender(el,i));
    } else if (el.category ==='progress') { 
        listProgress.appendChild(newTaskRender(el,i));
    } else if (el.category ==='done'){
        listDone.appendChild(newTaskRender(el,i));
    }
});
}

renderList(taskBase);

// render element 
function elementBuilder(el,clName,textInfo){
    let element = document.createElement(`${el}`);
    element.classList.add(`${clName}`);
    element.textContent = textInfo;
    return element;
}

// render newTask

function newTaskRender(el,i){
    let groundElement = elementBuilder('div','task');
    groundElement.id =(i+1);
    let taskTitle =  elementBuilder('div','task__title',el.title);
    let taskDescription = elementBuilder('div','task__description',el.description);
    let taskUser = elementBuilder('div','task__user',el.user);
    let taskData = elementBuilder('div','task__data', el.date);
    groundElement.appendChild(taskTitle);
    groundElement.appendChild(taskDescription);
    groundElement.appendChild(taskUser);
    groundElement.appendChild(taskData);
    groundElement.appendChild(elementBuilder('button','task__start','start'));
    groundElement.appendChild(elementBuilder('button','button__edit','edit'));
    groundElement.appendChild(elementBuilder('button','button__delete', 'delete'));
    return groundElement ;
    }
    

function newTaskCreate(){
    let newTitle = document.querySelector('#inputTitle');
    console.log(newTitle);

    newTaskCreate();
}
    // <div class="taskForm">
    //                 <label class="inputTitle" for="inputTitle">Title</label>                        
    //                 <input class="taskForm__title" type="text" id="inputTitle" placeholder="название">
    //                 <label class="inputDescription" for="inputDescription" text ="Description">Description</label>
    //                 <input class="taskForm__description" type="text" id="inputDescription" placeholder="Описание">
                    
    //                 <button class="taskForm__cancel">Cancel</button>
    //                 <button class="taskForm__confirm">Confirm</button>
    //                 <select class="taskForm__user">
    //                     <option class="user">User 1</option>
    //                     <option class="user">User 2</option>
    //                 </select>
    //             </div>