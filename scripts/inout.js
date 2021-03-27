import { LabelNotFoundError } from '../build/exceptions.js';
import app from './app.js';
import { generateNewTapeCell } from './generatehtml.js';
import {saveCookies} from './script.js';

// run inputs
export function getInputs(){
    let inputTape = document.getElementById("input-tape-container");
    let children = inputTape.children;
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
    let outputTape = document.getElementById("output-tape-container");
    let cells = outputTape.children;

    while (app.parser.outputs.length > outputTape.childElementCount){
        appendCellToTape("out", outputTape);
    }
    for(i = 0; i < app.parser.outputs.length; i++){
        cells[i].children[0].value = app.parser.outputs[i];
    }
}

export function clearOutputTape(){
    let tape = document.getElementById("output-tape-container").children;
    for(let cell of tape){
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
        lastElement = document.getElementById("input-tape-container").lastElementChild.previousElementSibling;
    }
    else if (type == "out"){
        lastElement = document.getElementById("output-tape-container").lastElementChild.previousElementSibling;
    }
    
    
    return (lastElement.getBoundingClientRect().left >=0 && lastElement.getBoundingClientRect().right <= window.innerWidth);
}

export function loadInputs(cookieObj){
    let inputTape = document.getElementById("input-tape-container");
    let children = inputTape.children;
    let inputs = cookieObj["inputs"]
        .replace(/\[/g, '')
        .replace(/\]/g, '')
        .split(",")
        .map(e=>{
            return parseInt(e);
        })
    console.log(inputs);
    inputs.forEach((input, index) => {
        children[index].children[0].value = input;
    });
}

export function inputTapeListenerCallback(){
    saveCookies();

}