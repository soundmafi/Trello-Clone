// elementBuilder Создаёт элемент на основе принимающих аргументов 
export function elementBuilder(el,clName,textInfo){
    let element = document.createElement(`${el}`);
    element.classList.add(`${clName}`);
    element.textContent = textInfo;
    return element;
}