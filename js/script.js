let listTodo = document.querySelector('.todo').querySelector('.task__list');            // Список колонки Todo
let listProgress = document.querySelector('.progress').querySelector('.task__list');    // Список колонки Progress
let listDone = document.querySelector('.done').querySelector('.task__list');            // Список коллонки Done
let counterTodo = document.querySelector('.todo').querySelector('.topic__count');       // Точка для счётчика тасков в Todo
let counterProgress = document.querySelector('.progress').querySelector('.topic__count');// Точка для счётчика тасков в Progress
let counterDone = document.querySelector('.done').querySelector('.topic__count');       // Точка для счётчика тасков в Done
let warning = document.querySelector('.warning');                                       // Попап предупреждения Warning

let taskBase = [];                              //Хранилище хранилище тасков
let userBase = [];                              //Хранилище пользователей

// Функция для получения данных и отрисовки элементов приложения при открытии приложения в браузере
function loaderStart(){
    getTasks();                                 //Получаем список тасков для первой отрисовки из LocalStorage
    renderList(taskBase);                       //Отрисовываем первоначальный списковтасков
    counterTasks(taskBase);                     //Считаем количество тасков в каждой колонке 
    getUsersStorage();                          //Получаем список пользователей из LocalStorage
    renderTaskForm();                           //Отрисовываем форму для новых тасков
}

loaderStart();

let taskForm = document.querySelector('.taskForm');

// Button Add Task
let btnAddTask = document.querySelector('.button__add');
btnAddTask.addEventListener('click',e =>{
    taskForm.classList.toggle('visible'); 
    let title = document.querySelector('#inputTitle');                          // инпут с заголовком
    let description = document.querySelector('#inputDescription');              // инпут с описанием таска
    title.value = '';                                                           // очистка заголовка
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
        taskBase = [];                                           //     - очищаем список тасков в хранилище
        rebuild();
        warning.classList.toggle('visible');                     //     - Скрываем попап warning
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
        groundElement.appendChild(elementBuilder('button','task__start','start'));
        groundElement.appendChild(elementBuilder('button','button__edit','edit'));
        groundElement.appendChild(elementBuilder('button','button__delete', 'delete'));
    } else if( el.category === 'progress'){
        groundElement.appendChild(elementBuilder('button','button__back','Back'));
        groundElement.appendChild(elementBuilder('button','button__complete', 'Complete'));
    } else if( el.category === 'done'){
        groundElement.appendChild(elementBuilder('button','button__delete', 'delete'));
    }
    // Добавляем прослушку на кнопки
    groundElement.addEventListener('click', event =>{
        let eventTouch = event.target.className;
        if (eventTouch === 'button__edit'){
            console.log('редактировать таск');
        }
        if (eventTouch === 'button__delete'){
            taskBase.splice(event.target.parentNode.id - 1, 1);
           rebuild();
        }
        if (eventTouch === 'task__start'){
            taskBase[event.target.parentNode.id-1].category = 'progress';
            rebuild();
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

// elementBuilder Создаёт элемент на основе принимающих аргументов 
function elementBuilder(el,clName,textInfo){
    let element = document.createElement(`${el}`);
    element.classList.add(`${clName}`);
    element.textContent = textInfo;
    return element;
}

// render newTaskForm Отрисовка модального окна для создания нового таска
function renderTaskForm(){
    let taskElement = elementBuilder('div','taskForm');
    // taskElement.classList.add('visible');
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
    return taskElement;
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
    taskBase.push(newTask);                             // записываем в хранилище сформарованный новый таск    
    rebuild();
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