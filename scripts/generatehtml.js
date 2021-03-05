import app from './app.js';

export function generateLineDiv(){
    let divLine = document.createElement("div");
    divLine.className = "line";
    divLine.id = `line-${app.lastLinesNum}`;
    return divLine;
}

export function generateBreakpointDiv(){
    let divPoint = document.createElement("div");
    divPoint.id = "point";
    return divPoint;
}

export function generateBreakpointBtn(){
    let buttonTemplate = document.getElementById("pointtemplate").lastElementChild;

    // clone to get all functionality
    let buttonPoint = buttonTemplate.cloneNode();
    buttonPoint.id = (app.lastLinesNum).toString();
    let buttonClassName = buttonPoint.className.split(" ");
    
    // make sure that the button is initialized as inactive
    buttonClassName[1] = "inactive";
    buttonPoint.className = buttonClassName.join(" ");
    return buttonPoint;
}

export function generateLineNumberDiv(){
    let divLineNumber = document.createElement("div");
    divLineNumber.className = "linenumber";
    divLineNumber.innerHTML = (app.lastLinesNum).toString();
    return divLineNumber;
}

export function generateNewTapeCell(type){
    let oldContainerId = `${type}put-tape-container`;
    
    //copy the last cell
    let newCell = document.getElementById(oldContainerId).lastElementChild.cloneNode(true);
    let idSplit = newCell.id.split("-");

    // get and increment the previous index
    let newIndex = parseInt(idSplit[1]) + 1;

    // generate new id 
    let newContainerId = `${idSplit[0]}-${newIndex}`;
    newCell.id = newContainerId;
    
    newCell.firstElementChild.value = "";
    newCell.lastElementChild.innerHTML = newIndex.toString();
    return newCell;
}