let listTodo = document.querySelector('.todo').querySelector('.task__list');
let listProgress = document.querySelector('.progress').querySelector('.task__list');
let listDone = document.querySelector('.done').querySelector('.task__list');

let taskBase = [];


function loaderStart(){
    getTasks();
    renderList(taskBase);
}

loaderStart();

//button Add Task
let btnAddTask = document.querySelector('.button__add');
btnAddTask.addEventListener('click',e =>{
    renderTaskForm();                                               //отрисвываем форму для заполнения таска
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

// TaskRender Создает элемент и вписывает все данные
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

// render list of tasks  Создаёт список из тасков. Расставляет в зависимости от категории.
function renderList(allTasks){
    
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

// render element 
function elementBuilder(el,clName,textInfo){
    let element = document.createElement(`${el}`);
    element.classList.add(`${clName}`);
    element.textContent = textInfo;
    return element;
}

// render newTaskForm Отрисовка модального окна с новым таском
function renderTaskForm(){
let taskElement = elementBuilder('div','taskForm');
taskElement.classList.add('visible');
taskElement.appendChild(elementBuilder('label','inputTitle','Title'));
let inputTitle = elementBuilder('input','taskForm__title');
inputTitle.id = 'inputTitle';
inputTitle.placeholder ='название';
taskElement.appendChild(inputTitle);
taskElement.appendChild(elementBuilder('label','inputDescription','Description'));
let inputDescription = elementBuilder('input','taskForm__description');
inputDescription.id = 'inputDescription';
inputDescription.placeholder = "Описание";
taskElement.appendChild(inputDescription);
taskElement.appendChild(elementBuilder('button','taskForm__cancel','Cancel'));
taskElement.appendChild(elementBuilder('button','taskForm__confirm','Confirm'));
taskElement.appendChild(elementBuilder('select','taskForm__user'));
document.body.appendChild(taskElement);
// button taskForm -> cancel, confirm and select
taskElement.addEventListener('click', event =>{
    let eventTouch = event.target.className;

    if (eventTouch === 'taskForm__cancel'){
        taskElement.classList.toggle('visible');
    }
    if (eventTouch === 'taskForm__confirm'){
        storeTask();
        taskElement.parentNode.removeChild(taskElement);
    }
    if (eventTouch === 'taskForm__user'){
        console.log('операция выбора юзера');
    }
});
return;
}

function storeTask(){
    let title = document.querySelector('#inputTitle');
    let description = document.querySelector('#inputDescription');
    let dateInfo = new Date;                        // Генерируем дату
    let textDate = `${dateInfo.getDate()} : ${dateInfo.getMonth() + 1} : ${dateInfo.getFullYear()}`;        
    let newTask = {    
        id: taskBase.length +1,
        category: 'todo',
        title: title.value,
        description: description.value,
        user: 'Вася',
        date: textDate
    };
    taskBase.push(newTask);
    sentTask();
    listTodo.innerHTML = '';
    listProgress.innerHTML = '';
    listDone.innerHTML = '';
    renderList(taskBase);
}

//Функции отправки и полуения данных из localStorage 
function sentTask() {                        //Отправка в localStorage
    if (localStorage.getItem('tasks')) {
        localStorage.clear();
        localStorage.setItem('tasks', JSON.stringify(taskBase));
    } else {
        localStorage.setItem('tasks', JSON.stringify(taskBase));
    }
}

function getTasks() {                         //Получение из localStorage
    if (localStorage.getItem('tasks')) {
        let request = JSON.parse(localStorage.getItem('tasks'));
        taskBase = [];
        request.forEach(el => {
            taskBase.push(el);
        });
    } else {
        taskBase = [];
    }
}