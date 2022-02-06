let btnAddTask = document.querySelector('.button__add');
btnAddTask.addEventListener('click',e =>{
    let taskform = document.querySelector('.taskForm');
    taskform.classList.add('visible');
});


let btnDeleteAll = document.querySelector('.button__deleteAll');
btnDeleteAll.addEventListener('click',e =>{
    let warning = document.querySelector('.warning');
    warning.classList.add('visible');
});






