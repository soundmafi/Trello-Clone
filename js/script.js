import {elementBuilder, buttonBuilder} from './renders.js';

let listTodo = document.querySelector('.todo').querySelector('.task__list');            // Список колонки Todo
let listProgress = document.querySelector('.progress').querySelector('.task__list');    // Список колонки Progress
let listDone = document.querySelector('.done').querySelector('.task__list');            // Список коллонки Done
let counterTodo = document.querySelector('.todo').querySelector('.topic__count');       // Точка для счётчика тасков в Todo
let counterProgress = document.querySelector('.progress').querySelector('.topic__count');// Точка для счётчика тасков в Progress
let counterDone = document.querySelector('.done').querySelector('.topic__count');       // Точка для счётчика тасков в Done
let warning = document.querySelector('.warning');
let overTask = document.querySelector('.overload');                                       // Попап предупреждения Warning
let edit = document.querySelector('.container');
let listUsers = document.querySelector('.users__list');                                        // Список назначенных пользователей
let usersTasksDisplay = document.querySelector('.users__taskDisplay');

let countProgress = 0;

let taskBase = [];                              //Хранилище хранилище тасков
let userBase = [];                              //Хранилище пользователей
let tempUsers = [];

loaderStart();

// Button Add Task
let btnAddTask = document.querySelector('.button__add');
btnAddTask.addEventListener('click',e =>{
    renderTaskForm();
    let taskForm = document.querySelector('.taskForm');
    taskForm.classList.toggle('visible'); 
    let title = document.querySelector('#inputTitle');                          // инпут с заголовком
    let description = document.querySelector('#inputDescription');              // инпут с описанием таска
    title.value = '';                                                            // очистка заголовка
    description.value = '';                                                     // очистка описания
});

// Button Delete All
let btnDeleteAll = document.querySelector('.button__deleteAll');
btnDeleteAll.addEventListener('click',e =>{
    warning.classList.toggle('visible');                         // По клику на кнопку показываем пользователю попап с предупрежедением
});

//Button Warning Cancel & Confirm
warning.addEventListener('click', event =>{
    let eventTouch = event.target.className;
    if (eventTouch === 'warning__cancel'){
        warning.classList.toggle('visible');                     // По клику на кнопку Cancel скрываем попап Warning                         
    }
    if (eventTouch === 'warning__confirm'){                      // По клику на кнопку Confirm:
        taskBase = taskBase.filter(el => el.category !== 'done');                                           //     - очищаем список тасков в хранилище
        rebuild();
        warning.classList.toggle('visible');                     //     - Скрываем попап warning
    }
});

// Функция для получения данных и отрисовки элементов приложения при открытии приложения в браузере
function loaderStart(){
    mobileTabs();
    userInfoRenderList(userBase);
    getTasks();                                 //Получаем список тасков для первой отрисовки из LocalStorage
    getUsersStorage();
    renderList(taskBase);                       //Отрисовываем первоначальный списковтасков
    counterTasks(taskBase);                     //Считаем количество тасков в каждой колонке                               //Получаем список пользователей из LocalStorage
}

//функция вызова моадльного окна при привышении лимита
overTask.addEventListener('click', event =>{
    let eventTouch = event.target.className;
    if (eventTouch === 'overload__confirm'){                      // По клику на кнопку Confirm:
        overTask.classList.toggle('visible');                     //     - Скрываем попап warning
    }
});

// taskRender отрисовывает элемент, сразу навешивает listener'ы на кнопки, вписывает все данные.
function taskRender(el,i){
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
    // В зависимости от категории добавляем соответсвующие кнопки
    if (el.category === 'todo'){                                                
        groundElement.appendChild(buttonBuilder('button','task__start'));
        groundElement.appendChild(buttonBuilder('button','button__edit'));
        groundElement.appendChild(buttonBuilder('button','button__delete'));
    } else if( el.category === 'progress'){
        groundElement.appendChild(buttonBuilder('button','button__back'));
        groundElement.appendChild(buttonBuilder('button','button__complete'));
    } else if( el.category === 'done'){
        groundElement.appendChild(buttonBuilder('button','button__delete'));
    }
    
    // Добавляем прослушку на кнопки
    groundElement.addEventListener('click', event =>{
        let eventTouch = event.target.className;
        if (eventTouch === 'button__edit'){
            let editedElement = taskBase[event.target.parentNode.id - 1];
            editTask(editedElement);
        }
        if (eventTouch === 'button__delete'){
            taskBase.splice(event.target.parentNode.id - 1, 1);
           rebuild();
        }
        if (eventTouch === 'task__start'){
            if (countProgress < 6){
            taskBase[event.target.parentNode.id-1].category = 'progress';
            rebuild();
            }else{
                overTask.classList.toggle('visible'); 
            }
        }
        if (eventTouch === 'button__back'){
            taskBase[event.target.parentNode.id-1].category = 'todo';
            rebuild();
        }
        if (eventTouch === 'button__complete'){
            taskBase[event.target.parentNode.id-1].category = 'done';
            rebuild();  
        }
    });
    return groundElement ;
    }

// renderList Создаёт список из тасков. Расставляе таски в соответствующие колонки в зависимости от категории.
function renderList(allTasks){
    allTasks.forEach((el,i)=>{
        if (el.category === 'todo'){
            listTodo.appendChild(taskRender(el,i));
        } else if (el.category ==='progress') { 
            listProgress.appendChild(taskRender(el,i));
        } else if (el.category ==='done'){
            listDone.appendChild(taskRender(el,i));
        }
    });
}

// render newTaskForm Отрисовка модального окна для создания нового таска
    function renderTaskForm(){
    let taskElement = elementBuilder('div','taskForm');
    taskElement.appendChild(elementBuilder('label','inputTitle','Title'));
    let inputTitle = elementBuilder('input','taskForm__title');
    inputTitle.id = 'inputTitle';
    inputTitle.setAttribute('autocomplete','off');
    inputTitle.placeholder ='название';
    taskElement.appendChild(inputTitle);
    taskElement.appendChild(elementBuilder('label','inputDescription','Description'));
    let inputDescription = elementBuilder('input','taskForm__description');
    inputDescription.id = 'inputDescription';
    inputDescription.setAttribute('autocomplete','off');
    inputDescription.placeholder = "Описание";
    taskElement.appendChild(inputDescription);
    taskElement.appendChild(elementBuilder('button','taskForm__cancel','Cancel'));
    taskElement.appendChild(elementBuilder('button','taskForm__confirm','Confirm'));
    taskElement.appendChild(elementBuilder('select','taskForm__users'));
    let select = taskElement.querySelector('.taskForm__users');          // находим в модальном окне точку для отрисовки в ней списка юзеров
    renderUser(select);                                                  // отрисовываем options с юземрами в select 
    document.body.prepend(taskElement);
    // добавляем на кнопки прослушку
    taskElement.addEventListener('click', event =>{
        let eventTouch = event.target.className;
        if (eventTouch === 'taskForm__cancel'){                         // по клику на cancel удаляем модальное окно
            taskForm.classList.toggle('visible');
        }
        if (eventTouch === 'taskForm__confirm'){                        // по клику на confirm записываем новый таск и удаляем модальное окно 
            storeTask();
            taskForm.classList.toggle('visible');
        }
    });
    let taskForm = document.querySelector('.taskForm');
    return taskForm;
}

// storeTask Фукнция сбора информации и записи его в хранилище
function storeTask(){
    let title = document.querySelector('#inputTitle');                          // инпут с заголовком
    let description = document.querySelector('#inputDescription');              // инпут с описанием таска
    let dateInfo = new Date;                        // Генерируем дату
    let textDate = `${dateInfo.getDate()} : ${dateInfo.getMonth() + 1} : ${dateInfo.getFullYear()}`; // дата
    let users = document.querySelector('.taskForm__users');                                 
    let user = users.querySelector(`option[value ='${users.value}']`).value;    // пользователь на которого назначили таск
    let newTask = {                                     // формируем данные таска
        id: taskBase.length +1,                         // присваиваем id
        category: 'todo',                               // по умолчанию присваиваем категорию "todo" 
        title: title.value,                             // заголовок
        description: description.value,                 // описание
        user: user,                                     // назаченный пользователь
        date: textDate                                  // дата
    };

    let newUser = { 
        name: user,
        tasks: []
    }
    if ((newTask.title === '') || (newTask.description === '')){
        console.log('заполнить все поля');

    }else{
        taskBase.push(newTask);                             // записываем в хранилище сформарованный новый таск    
        rebuild();
     }
}

//Отправка тасков в localStorage
function sentTask() {                        
    if (localStorage.getItem('tasks')) {                         // если в lS что-то есть, то
        localStorage.removeItem('tasks');                        // очищаем
        localStorage.setItem('tasks', JSON.stringify(taskBase)); //записываем новые данные
    } else {                                                     // если ничего нет, то  
        localStorage.setItem('tasks', JSON.stringify(taskBase)); // записываем данные
    }
}

//Получение тасков из localStorage
function getTasks() {                                               
    if (localStorage.getItem('tasks')) {                          
        taskBase = JSON.parse(localStorage.getItem('tasks'));
    } else {                                                      
        taskBase = [];                                       
    }
}

// функция очистки списков в колонках
function clearLists(){
    listTodo.innerHTML = '';
    listProgress.innerHTML = '';
    listDone.innerHTML = '';
}

// функция подсчёта тасков в каждой колонке
function counterTasks(taskBase){
    let countTodo = 0;
    countProgress = 0;
    let countDone = 0;
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
    return countProgress;
}

// получение пользователей с сервера
async function getUsers(){ 
    userBase = await fetch('https://jsonplaceholder.typicode.com/users/').then(response => response.json());
    sentUsersStorage(userBase);
    return userBase;
}

// отправка users в localStorage
function sentUsersStorage(users) {                        
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(users));
    }
}

//Получение user из localStorage или fetch
function getUsersStorage() {                         
    if (localStorage.getItem('users')) {
        userBase = JSON.parse(localStorage.getItem('users'));
        }else{
            getUsers();
        }
}

// отрисовка юзеров в модальном окне 
function renderUser(listPoint){        
    userBase.forEach(({name})=> {
       let user = elementBuilder('option','taskForm__user');
       user.value = name;
       user.innerText =`${name}`;
       listPoint.appendChild(user);
    });
}

// функция "перестроения" после изменений
function rebuild(){
    sentTask();
    clearLists();
    counterTasks(taskBase);
    renderList(taskBase);
}

window.onload = function() {
    setInterval(function() {
      let minutes = new Date().getMinutes();
      document.getElementById("minutes").innerHTML = (minutes < 10 ? '0' : '') + minutes;
      let hours = new Date().getHours();
      document.getElementById("hours").innerHTML = (hours < 10 ? '0' : '') + hours;
    }, 1000);
  }

function editTask(element){
    let taskEdit = elementBuilder('div','taskEdit');
    taskEdit.classList.add('visible');
    taskEdit.appendChild(elementBuilder('label','inputTitle','Title'));
    let inputTitle = elementBuilder('input','taskForm__title');
    inputTitle.id = 'inputTitle';
    inputTitle.value = element.title;
    taskEdit.appendChild(inputTitle);
    taskEdit.appendChild(elementBuilder('label','inputDescription','Description'));
    let inputDescription = elementBuilder('input','taskForm__description');
    inputDescription.id = 'inputDescription';
    inputDescription.value = element.description;
    taskEdit.appendChild(inputDescription);
    taskEdit.appendChild(elementBuilder('button','taskForm__cancel','Cancel'));
    taskEdit.appendChild(elementBuilder('button','taskForm__confirm','Confirm'));
    taskEdit.appendChild(elementBuilder('select','taskForm__users'));
    let select = taskEdit.querySelector('.taskForm__users');          
    renderUser(select);                                                   
    edit.appendChild(taskEdit);
    // добавляем на кнопки прослушку
    taskEdit.addEventListener('click', event =>{
        let eventTouch = event.target.className;
        if (eventTouch === 'taskForm__cancel'){                         // по клику на cancel удаляем модальное окно
            taskEdit.parentNode.removeChild(taskEdit);
        }
        if (eventTouch === 'taskForm__confirm'){                        // по клику на confirm записываем новый таск и удаляем модальное окно
            let title = taskEdit.querySelector('#inputTitle');                          // инпут с заголовком
            let description = taskEdit.querySelector('#inputDescription');              // инпут с описанием таска
            taskBase[element.id-1].title = title.value;
            taskBase[element.id-1].description = description.value;
            rebuild();
            taskEdit.parentNode.removeChild(taskEdit);
        }
    });
    return;
}

function mobileTabs() {
  if (window.innerWidth < 500) {

    let allTopics = document.querySelectorAll('.topic');
    listTodo.classList.add('invisible');
    listProgress.classList.add('invisible');

    allTopics.forEach(el=>{
        el.addEventListener('click', e =>{
            let numberClass = e.target.parentNode.parentNode.classList[1];
            let elClass = e.target.parentNode.classList[1];
            if ((elClass === 'todo') || (numberClass === 'todo')){ 
                    listTodo.classList.toggle('invisible');
                    if(!listProgress.classList.contains('invisible')){
                        listProgress.classList.toggle('invisible');                       
                    }
                    if(!listDone.classList.contains('invisible')){
                        listDone.classList.toggle('invisible');
                    }
            }else if ((elClass === 'progress') || (numberClass === 'progress')){
                    listProgress.classList.toggle('invisible');
                    if(!listTodo.classList.contains('invisible')){
                        listTodo.classList.toggle('invisible');                       
                    }
                    if(!listDone.classList.contains('invisible')){
                        listDone.classList.toggle('invisible');
                    }
                
            }else if((elClass === 'done') || (numberClass === 'done')){
                    listDone.classList.toggle('invisible');
                    if(!listTodo.classList.contains('invisible')){
                        listTodo.classList.toggle('invisible');                       
                    }
                    if(!listProgress.classList.contains('invisible')){
                        listProgress.classList.toggle('invisible');
                    }
            }
        });
    })
  }
};

let buttonSetting = document.querySelector('.button__settings');
    buttonSetting.addEventListener('click', event =>{
    let modalUsers = document.querySelector('.users');
    modalUsers.classList.toggle('visible');
    userInfoRenderList(userBase);
});

function userInfoRenderList(users){
    tempUsers = [];
    listUsers.innerHTML = '';

    users.forEach(el =>{
        let counter = 0;
        let userName = el.name;        
        taskBase.forEach(el => {
            if (el.user === userName){
                counter++;
            }
        });

        let obj = {
            user: userName,
            counter: counter
        }
        tempUsers.push(obj);
    });

    tempUsers.sort(function(a,b){
          return  b.counter - a.counter;
    });

    tempUsers.forEach(el =>{
        let userElement = buttonBuilder('div','users__block');
        userElement.appendChild(elementBuilder('p','users__name',`${el.user}`));
        userElement.appendChild(elementBuilder('p','users__tasks',`${el.counter}`));
        listUsers.appendChild(userElement);
    });
}

listUsers.addEventListener('click', event =>{
    let selectedUser = event.target.innerText;
    if (selectedUser !== ''){
    usersTasksDisplay.innerHTML = '';    
    taskBase.forEach(el =>{
        if (el.user === selectedUser){
            usersTasksDisplay.appendChild(elementBuilder('p','users__taskName',`${el.title}`));
        }
    });
}
})