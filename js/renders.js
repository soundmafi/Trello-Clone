// elementBuilder Создаёт элемент на основе принимающих аргументов 
export function elementBuilder(el,clName,textInfo){
    let element = document.createElement(`${el}`);
    element.classList.add(`${clName}`);
    element.textContent = textInfo;
    return element;
}

export function buttonBuilder(el,clName){
    let element = document.createElement(`${el}`);
    element.classList.add(`${clName}`);
    return element;
}