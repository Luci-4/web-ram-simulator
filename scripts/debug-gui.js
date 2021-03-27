import app from './app.js';


export function clearMarginLineHighlights(){
    let lines = document.getElementById("lines").children;
    for(let line of lines){
        
        line.classList.remove("line-highlight");
        
    }

}

export function enableStopIcon(type){

    let icon = document.getElementById(`stop-icon`);
    let button = document.getElementById(`stop-button`);

    icon.src = "/images/stop-icon.png";
    button.classList.add("stop-active");
    button.classList.add(`${type}-active`);
    button.style.cursor = "pointer";
}


export function disableStopIcon(){
    let icon = document.getElementById(`stop-icon`);
    let button = document.getElementById(`stop-button`);
    clearMarginLineHighlights();
    clearCellHighlight();
    icon.src = "/images/stop-inactive-icon.png";
    button.classList.remove("stop-active");
    button.style.cursor = "auto";
}

export function enableContinueButton(){
    let continueBtn = document.getElementById("debugger-continue");
    continueBtn.disabled = false;
    continueBtn.style.cursor = "pointer";
}

export function disableContinueButton(){
    let continueBtn = document.getElementById("debugger-continue");
    continueBtn.disabled = true;
    continueBtn.style.cursor = "auto";
}


export function updateLineMarginHighlight(){
    
    if (app.parser.lexer.contents.length === app.parser.execHead){
        disableStopIcon();
        return;
    }
    let currentMarginLine = document.getElementById(`line-${app.parser.execHead+1}`);
    currentMarginLine.classList.add("line-highlight");
}

export function enableBreakpointButtons(){
    let breakpointbtns = document.getElementsByClassName("point");
    for(let pointBtn of breakpointbtns){
        pointBtn.disabled = false;
        pointBtn.style.cursor = "pointer";
    }
}


export function disableBreakpointButtons(){
    let breakpointbtns = document.getElementsByClassName("point");
    for(let pointBtn of breakpointbtns){
        pointBtn.disabled = true;
        pointBtn.style.cursor = "auto";
    }
}


export function showDebugControls(){
    // document.getElementById("debug-controls").style.display = "inline";
    let controlButtons = document.getElementsByClassName("debug-control");
    for (let button of controlButtons){
        button.style.display = "inline";
    }
    
}


export function hideDebugControls(){
    // document.getElementById("debug-controls").style.display = "none";
    let controlButtons = document.getElementsByClassName("debug-control");
    for (let button of controlButtons){
        button.style.display = "none";
    }
}

function clearCellHighlight(){
    for (let cellContainer of app.inputTape.children){
        
        cellContainer.children[0].classList.remove("cell-highlight");
    }

    for (let cellContainer of app.outputTape.children){
        
        cellContainer.children[0].classList.remove("cell-highlight");
    }
}

export function updateCellHighlight(){
    clearCellHighlight();
    app.inputTape.children[app.parser.inputHead].children[0].classList.add("cell-highlight");
    app.outputTape.children[app.parser.outputHead].children[0].classList.add("cell-highlight");
}