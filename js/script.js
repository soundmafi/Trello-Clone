let listTodo = document.querySelector('.todo').querySelector('.task__list');
let listProgress = document.querySelector('.progress').querySelector('.task__list');
let listDone = document.querySelector('.done').querySelector('.task__list');
let counterTodo = document.querySelector('.todo').querySelector('.topic__count');
let counterProgress = document.querySelector('.progress').querySelector('.topic__count');
let counterDone = document.querySelector('.done').querySelector('.topic__count');

let taskBase = [];                              //Хранилище хранилище тасков
let userBase = [];                              //Хранилище пользователей

function loaderStart(){
    getTasks();                                 //Получаем список тасков для первой отрисовки
    renderList(taskBase);                       //Отрисовываем первоначальный списк тасков
    counterTasks(taskBase);
    getUsersStorage();
}
loaderStart();      

//button Add Task
let btnAddTask = document.querySelector('.button__add');
btnAddTask.addEventListener('click',e =>{
    renderTaskForm();                                            //отрисвываем форму для заполнения таска
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
        taskBase = [];
        sentTask();
        clearLists();
        warning.classList.toggle('visible');
        counterTasks(taskBase);
    }
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
    if (el.category === 'todo'){
        groundElement.appendChild(elementBuilder('button','task__start','start'));
        groundElement.appendChild(elementBuilder('button','button__edit','edit'));
        groundElement.appendChild(elementBuilder('button','button__delete', 'delete'));
    } else if( el.category === 'progress'){
        groundElement.appendChild(elementBuilder('button','button__back','Back'));
        groundElement.appendChild(elementBuilder('button','button__complete', 'Complete'));
    } else if( el.category === 'done'){
        groundElement.appendChild(elementBuilder('button','button__delete', 'delete'));
    }


    groundElement.addEventListener('click', event =>{
        let eventTouch = event.target.className;
        if (eventTouch === 'button__edit'){
            console.log('редактировать таск');
        }
        if (eventTouch === 'button__delete'){
            taskBase.splice(event.target.parentNode.id - 1, 1);
            sentTask();
            clearLists();
            renderList(taskBase);
            counterTasks(taskBase);
            console.log('удалить таск');
        }
        if (eventTouch === 'task__start'){
            taskBase[event.target.parentNode.id-1].category = 'progress';
            sentTask();
            clearLists();
            renderList(taskBase);
            counterTasks(taskBase);
        }
        if (eventTouch === 'button__back'){
            taskBase[event.target.parentNode.id-1].category = 'todo';
            sentTask();
            clearLists();
            renderList(taskBase);
            counterTasks(taskBase);
        }
        if (eventTouch === 'button__complete'){
            taskBase[event.target.parentNode.id-1].category = 'done';
            sentTask();
            clearLists();
            renderList(taskBase);
            counterTasks(taskBase);
            console.log('завершить таск');    
        }
    });
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
    taskElement.appendChild(elementBuilder('select','taskForm__users'));
    let select = taskElement.querySelector('.taskForm__users');
    console.log(select);
    renderUser(select);    
    console.log(userBase);
    document.body.appendChild(taskElement);

taskElement.addEventListener('click', event =>{
    let eventTouch = event.target.className;
    if (eventTouch === 'taskForm__cancel'){
        taskElement.parentNode.removeChild(taskElement);
    }
    if (eventTouch === 'taskForm__confirm'){
        storeTask();
        taskElement.parentNode.removeChild(taskElement);
    }
    if (eventTouch === 'taskForm__users'){
        console.log(event.target[selected]);
    }
});
return;
}

function storeTask(){
    let title = document.querySelector('#inputTitle');
    let description = document.querySelector('#inputDescription');
    let dateInfo = new Date;                        // Генерируем дату
    let textDate = `${dateInfo.getDate()} : ${dateInfo.getMonth() + 1} : ${dateInfo.getFullYear()}`; 
    
    let users = document.querySelector('.taskForm__users');
    let user = users.querySelector(`option[value ='${users.value}']`).value;


      
    let newTask = {    
        id: taskBase.length +1,
        category: 'todo',
        title: title.value,
        description: description.value,
        user: user,
        date: textDate
    };
    taskBase.push(newTask);
    sentTask();
    clearLists();
    renderList(taskBase);
    counterTasks(taskBase);
}

//Функции отправки и полуения данных из localStorage 
function sentTask() {                        //Отправка в localStorage
    if (localStorage.getItem('tasks')) {
        localStorage.removeItem('tasks');
        localStorage.setItem('tasks', JSON.stringify(taskBase));
    } else {
        localStorage.setItem('tasks', JSON.stringify(taskBase));
    }
}

function getTasks() {                         //Получение из localStorage
    if (localStorage.getItem('tasks')) {
        let request = JSON.parse(localStorage.getItem('tasks'));
        taskBase = [];
        taskBase = request;
    } else {
        taskBase = [];
    }
}

function clearLists(){
    listTodo.innerHTML = '';
    listProgress.innerHTML = '';
    listDone.innerHTML = '';
}

function counterTasks(taskBase){
    let countTodo = 0;
    let countProgress = 0;
    let countDone = 0
    taskBase.forEach(el =>{
        if (el.category === 'todo'){
            countTodo++;
        }else if(el.category === 'progress'){
            countProgress++;
        }else if(el.category === 'done'){
            countDone++;
        }
    });
    counterTodo.innerHTML = countTodo;
    counterProgress.innerHTML = countProgress;
    counterDone.innerHTML = countDone;
}

// получение пользователей
async function getUsers(){
    const response = await fetch('https://jsonplaceholder.typicode.com/users/');
    const users = await response.json();
    userBase = users;
    sentUsersStorage(userBase);
//     userBase.forEach(({name}) =>{
//         console.log(name);
// });
    return userBase;
}

function sentUsersStorage(users) {                        //Отправка users в localStorage
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function getUsersStorage() {                         //Получение user из localStorage или fetch
    if (localStorage.getItem('users')) {
        let requestUsers = JSON.parse(localStorage.getItem('users'));
        userBase = requestUsers;
        }else{
            getUsers();
        }
}

function renderUser(listPoint){        
    userBase.forEach(({name})=> {
       let user = elementBuilder('option','taskForm__user');
       user.value = name;
       user.innerText =`${name}`;
       listPoint.appendChild(user);
    });
}