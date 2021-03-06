import app from './app.js';
import {
    getInputs, 
    updateOutputTape, 
    clearOutputTape, 
    appendCellToTape, 
    isSecondToLastCellIsVisible
} from './inout.js';

import {
    updateConsole, 
    clearConsole, 
    initResize
} from './console.js';

import {
    generateLineDiv, 
    generateBreakpointDiv, 
    generateBreakpointBtn, 
    generateLineNumberDiv
} from './generatehtml.js';

import {
    updateLineMarginHighlight, 
    clearMarginLineHighlights, 
    showDebugControls, 
    hideDebugControls, 
    enableStopIcon, 
    disableStopIcon,
    enableContinueButton,
    disableContinueButton,
    disableBreakpointButtons,
    enableBreakpointButtons
} from './debug-gui.js';

import {
    onEditorInputCallback,
    keyboardListenerCallback,
    getNumberOfLines,
    OnInput
} from './editor.js';


var nIntervId;
setup();




function setup(){
    loadColorTheme();
    app.editor.onkeydown = keyboardListenerCallback;
    app.editor.addEventListener("input", onEditorInputCallback);
    app.editor.oninput = updateEditorMargin;
    window.onclick = windowOnclickCallback;
    document.getElementById("file-upload").addEventListener("change", loadFile);

    for (let i = 0; i < app.editor.length; i++) {
        app.editor[i].setAttribute('style', 'height:' + (app.editor[i].scrollHeight) + 'px;overflow-y:hidden;');
        
        app.editor[i].addEventListener("input", OnInput, false);
      }
      //initialize the console resizer div
      let resizer = document.getElementById("console-resizer");
      resizer.addEventListener('mousedown', initResize, false);

}
function loadColorTheme(){
    let colorTheme = app.colorTheme;
    document.body.style.background = colorTheme["Editor"];
    app.editor.style.background = colorTheme["Editor"];
    app.editor.style.color = colorTheme["EditorTextColor"];
    document.getElementsByTagName("nav")[0].style.background = colorTheme["ToolbarBackground"];
    document.getElementById("textarea-console").style.background = colorTheme["ConsoleBackground"];
    document.getElementById("textarea-console").style.color = colorTheme["ConsoleTextColor"];
    document.getElementById("input-tape").style.background = colorTheme["TapeBackground"];
    document.getElementById("output-tape").style.background = colorTheme["TapeBackground"];
    document.getElementById("lines").style.background = colorTheme["Editor"];
    let cells = document.getElementsByClassName("cell");
    for(let cell of cells){
        cell.style.background = colorTheme["TapeCellBackground"];
        cell.style.color = colorTheme["TapeTextColor"];
    }

    let captions = document.getElementsByClassName("caption");
    for(let caption of captions){
        caption.style.background = colorTheme["TapeCaptionsBackground"];
        caption.style.color = colorTheme["TapeCaptionColor"];
    }
    let tapeNavButtons = document.getElementsByClassName("tape-nav");
    for(let button of tapeNavButtons){
        button.style.background = colorTheme["TapeButtons"];
    }

}

function stopRun(){
    let button = document.getElementById(`stop-button`);
    disableStopIcon();
    button.classList.remove(`run-active`);
    app.parser.execHead = app.parser.lexer.programLength;
    updateConsole();
    updateOutputTape();

}


function stopDebug(){
    let button = document.getElementById(`stop-button`);
    hideDebugControls();
    button.classList.remove(`debug-active`);
    updateConsole();
    clearOutputTape();
    clearMarginLineHighlights();
    enableBreakpointButtons();
    disableStopIcon();
}
    

export function stop(){
    clearInterval(nIntervId);
    let button = document.getElementById(`stop-button`);

    if (button.classList.contains(`run-active`)){ stopRun(); }

    else if(button.classList.contains(`debug-active`)){ stopDebug(); }
}


export function run() {
    stop();
    // visual setup
    clearConsole();
    clearOutputTape();
    enableStopIcon("run");
    
    // load the program
    let program = app.editor.value;
    
    // interpret and check for errors
    if(!app.parser.init(program, getInputs())){
        stop();
        return 1;
    }
    nIntervId = setInterval(step, 500);
    
}

function step(){
    let stepResult = app.parser.step();
    if (stepResult === 1){
        console.log("returned 1");
        stop();
    }
    else if (stepResult === 0){
        console.log("returned 0")
        stop();
    }
    updateOutputTape();
}

export function debug(){

    stop();

    // visual setup
    clearConsole();
    clearOutputTape();
    enableStopIcon("debug");

    disableBreakpointButtons();
    showDebugControls();
    enableContinueButton();
    let program = app.editor.value;

    // interpret and check for errors
    if (!app.parser.init(program, getInputs(), app.breakpoints)){
        stop();
        return 1;
    }
    stepDebugger();
}


function stopOnBreakpoint(){

    clearInterval(nIntervId);
    enableContinueButton();
}

export function stepDebugger(){
    
    clearMarginLineHighlights();
    updateLineMarginHighlight();
    step();
    if(app.parser.breakpoints.includes(app.parser.execHead)){
        stopOnBreakpoint();
    }

}


export function continueToTheNextPoint(){
    
    disableContinueButton();
    nIntervId = setInterval(stepDebugger, 500);
    
}




export function switchBreakpoint(index) {
    let classNameArray = ["point"];
    let point = document.getElementById(index)
    let state = point.className.split(" ")[1];
    if(state === "inactive"){
        classNameArray.push("active");
        app.breakpoints.push(parseInt(index));
    }else if(state === "active"){
        classNameArray.push("inactive");
        let pointIndex = app.breakpoints.indexOf(parseInt(index));
        app.breakpoints.splice(pointIndex, 1);
    }
    
    point.className = classNameArray.join(" ");
    
    
    
}



export function updateEditorMargin(){
    let currentLineNum = getNumberOfLines();
    if (currentLineNum === app.lastLinesNum){
        return
    }
    while (app.lastLinesNum < currentLineNum){
        app.lastLinesNum++;

        // generating html elements with updated properties
        let divLine = generateLineDiv();
        let divPoint = generateBreakpointDiv();
        let divLineNumber = generateLineNumberDiv();
        let buttonPoint = generateBreakpointBtn();
        

        divPoint.appendChild(buttonPoint);
        divLine.appendChild(divPoint);
        divLine.appendChild(divLineNumber);

        document.getElementById("lines").appendChild(divLine);
        
    }
    while(app.lastLinesNum > currentLineNum){
        
        const linesContainer = document.getElementById("lines");
        
        app.lastLinesNum--;
        linesContainer.removeChild(linesContainer.lastElementChild);
        
    }
    app.lastLinesNum = currentLineNum;

    
}



export function moveTapeRight(type){
    
    let tape;
    if(type === "in"){
        
        tape = document.getElementById("input-tape-container");
    }
    else if (type === "out"){
        tape = document.getElementById("output-tape-container");
    }
    
    
    let scrollStep = tape.clientWidth / 10;
    
    if(isSecondToLastCellIsVisible(type)){
        appendCellToTape(type, tape);
    }
    tape.scrollLeft += scrollStep;
}


export function moveTapeLeft(type){
    let tape;
    if (type === "in"){
        tape = document.getElementById("input-tape-container");
    }
    else if (type == "out"){
        tape = document.getElementById("output-tape-container");
    }
    
    let scrollStep = tape.clientWidth / 10;
    
    tape.scrollLeft -= scrollStep;
    
}


export function showDropdown(tool){
    let currentId = tool + "-dropdown";
    closeOtherDropdowns(currentId);
    document.getElementById(currentId).classList.toggle("show");
    
}
function closeOtherDropdowns(id = ""){
    let dropdowns = document.getElementsByClassName('dropdown-content');
    for (let dropdown of dropdowns){
        if (dropdown.id !== id && dropdown.classList.contains('show')){
            dropdown.classList.remove("show");
        }
    }
}

function windowOnclickCallback(event) {
    if(!event.target.className.includes("tool-button")){
        closeOtherDropdowns();
        
    }
}

function generateFileName(){
    let today = new Date();
    let month = today.getMonth()+1;
    month = month + "";
    let day = today.getDate() + "";
    let hours = today.getHours() + "";
    let minutes = today.getMinutes() + "";
    let seconds = today.getSeconds() + "";
    let dateDataArr = [
        month,
        day, 
        hours, 
        minutes, 
        seconds
    ];
    dateDataArr = dateDataArr.map((element) => {
        if (element.length === 1){
            return "0".concat("", element);
        }
        else {
            return element
        }   
        
    });
    
    let year = (today.getFullYear() + "").substring(2);
    let date = year + dateDataArr.join("");
    return date;
}

export function save(filename = ""){
    if(filename.length === 0){
        filename = "ram" + generateFileName();
    }
    let content = app.editor.value;
    const a = document.createElement('a');
    const file = new Blob([content], {type: "text/plain"});

    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
}


function loadFile(event){
    const reader = new FileReader();
    reader.addEventListener("load", (loadEvent) => {
        let value = loadEvent.target.result;
        app.editor.value = value;
        updateEditorMargin();
    });
    reader.readAsText(event.target.files[0]);
    
}
