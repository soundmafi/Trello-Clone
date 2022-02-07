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
