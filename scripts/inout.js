import app from './app.js';
import {getInputValues, saveInputsToCookies } from './cookies.js';
import { generateNewTapeCell } from './generatehtml.js';

// run inputs
export function getInputs(){
    let children = app.inputTape.children;
    let inputs = [];
    for(let cellContainer of children){
        let index = parseInt(cellContainer.id.slice(cellContainer.id.indexOf("-")+1)) - 1;
        let cellValue = undefined;
        
        if (cellContainer.firstElementChild.value.length !== 0){
            cellValue = cellContainer.firstElementChild.value;
            if (cellValue.length > 0){
                inputs[index] = parseInt(cellValue);
            }
        }
    }
    return inputs;
}

// run update output
export function updateOutputTape(){
    let i;
    let cells = app.outputTape.children;

    while (app.parser.outputs.length > app.outputTape.childElementCount){
        appendCellToTape("out", app.outputTape);
    }
    for(i = 0; i < app.parser.outputs.length; i++){
        cells[i].children[0].value = app.parser.outputs[i];
    }
}

export function clearOutputTape(){
    for(let cell of app.outputTape.children){
        let inputField = cell.firstElementChild;
        inputField.value = "";
    }
}

export function appendCellToTape(type, tape){
    let newCell = generateNewTapeCell(type);
    tape.appendChild(newCell);
}

export function isSecondToLastCellIsVisible(type){
    let lastElement;
    if (type === "in"){
        lastElement = app.inputTape.lastElementChild.previousElementSibling;
    }
    else if (type == "out"){
        lastElement = app.outputTape.lastElementChild.previousElementSibling;
    }
    
    
    return (lastElement.getBoundingClientRect().left >=0 && lastElement.getBoundingClientRect().right <= window.innerWidth);
}

export function loadInputs(cookieObj){
    let children = app.inputTape.children;
    
    let inputs = getInputValues(cookieObj)
    
    inputs?.forEach((input, index) => {
        if(!Number.isNaN(input)){
            
            children[index].children[0].value = input;
        }
        
    });
}

export function inputTapeListenerCallback(){
    saveInputsToCookies(getInputs());

}