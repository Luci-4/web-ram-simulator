import {App} from './main.js';
let app = new App();


let lastLinesNum = 1;
let breakpoints = [];
var nIntervId;
const keywords = [
    "read",
    "load",
    "store",
    "add",
    "sub",
    "mult",
    "div",
    "jump",
    "jgtz",
    "jzero",
    "write",
    "halt"
];
const colorThemes = {
    DARK : {
        Editor: "#181818",
        EditorHighlight: "",
        ConsoleBackground: "black",
        EditorTextColor: "",
        ConsoleTextColor: "",
        ButonOnHover: "",
        ToolbarBackground: "#242424",
        TapeCellBackground: "",
        TapeBackground: "",
        TapeButtons: "",
        TapeTextColor: "",
        TapeCaptionColor: "#061027"
    },

    BLUE : {
        // Editor: "#071330",
        Editor: "#040e27",
        EditorHighlight: "#0C4160",
        // CONSOLE: "#09193d",
        ConsoleBackground: "#061027",
        EditorTextColor: "#df9e25",
        ConsoleTextColor: "#C3CEDA",
        ButonOnHover: "",
        ToolbarBackground: "#071330",
        TapeCellBackground: "#0074B7",
        TapeBackground: "#738FA7",
        TapeCaptionsBackground: "#7EC8E3",
        TapeButtons: "#C3CEDA",
        TapeTextColor: "#C3CEDA",
        TapeCaptionColor: "#061027"
    },

    MATRIX : {
        Editor: "black",
        EditorHighlight: "",
        ConsoleBackground: "black",
        EditorTextColor: "green",
        ConsoleTextColor: "#46e446",
        ButonOnHover: "",
        ToolbarBackground: "#002400",
        TapeCellBackground: "",
        TapeBackground: "",
        TapeCaptionsBackground:"",
        TapeButtons: "",
        TapeTextColor: "",
        TapeCaptionColor: "#061027"
    },
    RANDOM : {
        Editor: "black",
        EditorHighlight: "red",
        ConsoleBackground: "purple",
        EditorTextColor: "green",
        ConsoleTextColor: "white",
        ButonOnHover: "#6c757e",
        ToolbarBackground: "#071330",
        TapeCellBackground: "lightblue",
        TapeBackground: "thistle",
        TapeCaptionsBackground: "lightcoral",
        TapeButtons: "blue",
        TapeCaptionColor: "#061027"
    }


}
let colorTheme = colorThemes['BLUE'];

function setColorTheme(){
    document.body.style.background = colorThemes["Editor"];
    document.getElementById("textarea-editor").style.background = colorTheme["Editor"];
    document.getElementById("textarea-editor").style.color = colorTheme["EditorTextColor"];
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
// document.addEventListener('keydown', generalKeyboardCallback);
document.getElementById("textarea-editor").oninput = generalKeyboardCallback;

function generalKeyboardCallback(event){
    updateEditorMargin();
}

function getInputs(){
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

function updateConsole(){
    let debugcon = document.getElementById("console-lines");
    
    for(let message of app.debugConsole){
        debugcon.innerHTML += message;
        
    }

}
function clearConsole(){
    let debugcon = document.getElementById("console-lines");
    
    debugcon.innerHTML = "";
    
}

function updateOutputTape(){
    let i;
    let outputTape = document.getElementById("output-tape-container");
    let cells = outputTape.children;

    while (app.outputs.length > outputTape.childElementCount){
        appendCellToTape("out", outputTape);
    }
    for(i = 0; i < app.outputs.length; i++){
        cells[i].children[0].value = app.outputs[i];
    }
}

function enableStopIcon(type){

    let icon = document.getElementById(`stop-icon`);
    let button = document.getElementById(`stop-button`);

    icon.src = "/images/stop-icon.png";
    button.classList.add("stop-active");
    button.classList.add(`${type}-active`);
    button.style.cursor = "pointer";
}
function disableStopIcon(){
    let icon = document.getElementById(`stop-icon`);
    let button = document.getElementById(`stop-button`);
    clearMarginLineHighlights();
    icon.src = "/images/stop-inactive-icon.png";
    button.classList.remove("stop-active");
    button.style.cursor = "auto";

    
    
}

function clearOutputTape(){
    let tape = document.getElementById("output-tape-container").children;
    for(let cell of tape){
        let inputField = cell.firstElementChild;
        inputField.value = "";
    }
}
function stopRun(){
    let button = document.getElementById(`stop-button`);
    disableStopIcon();
    button.classList.remove(`run-active`);
    app.execHead = app.lexer.programLength;
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
    let program = document.getElementById("textarea-editor").value;
    
    // interpret and check for errors
    if(!app.init(program, getInputs())){
        stop();
        return 1;
    }
    nIntervId = setInterval(step, 500);
    
}

function step(){
    let stepResult = app.step();
    if (stepResult === 1){
        console.log("app.step returned 1");
        stop();
    }
    else if (stepResult === 0){
        console.log("app.step returned 0")
        stop();
    }
    updateOutputTape();
}

function clearMarginLineHighlights(){
    let lines = document.getElementById("lines").children;
    for(let line of lines){
        
        line.style.backgroundColor = colorTheme["Editor"];
        
    }

}

function updateLineMarginHighlight(){
    
    if (app.lexer.contents.length === app.execHead){
        disableStopIcon();
        return;
    }
    let currentMarginLine = document.getElementById(`line-${app.execHead+1}`);
    currentMarginLine.style.backgroundColor = colorTheme["EditorHighlight"];
}

function showDebugControls(){
    document.getElementById("debug-controls").style.display = "inline";
    
}

function hideDebugControls(){
    document.getElementById("debug-controls").style.display = "none";
}
export function debug(){

    stop();

    // visual setup
    clearConsole();
    clearOutputTape();
    enableStopIcon("debug");

    showDebugControls();
    let program = document.getElementById("textarea-editor").value;
    let firstMarginLine = document.getElementById("line-1");
    // firstMarginLine.style.backgroundColor = colorTheme['EditorHighlight'];

    // interpret and check for errors
    if (!app.init(program, getInputs(), breakpoints)){
        stop();
        return 1;
    }
    stepDebugger();
}

function stopOnBreakpoint(){

    clearInterval(nIntervId);
    let continueBtn = document.getElementById("debugger-continue");
    continueBtn.disabled = false;
    continueBtn.style.cursor = "pointer";

}
export function stepDebugger(){
    
    clearMarginLineHighlights();
    updateLineMarginHighlight();
    step();
    if(app.breakpoints.includes(app.execHead)){
        stopOnBreakpoint();
    }

}

export function continueToTheNextPoint(){
    let continueBtn = document.getElementById("debugger-continue");
    continueBtn.disabled = true;
    continueBtn.style.cursor = "auto";
    
    nIntervId = setInterval(stepDebugger, 500);
    
}

function getNumberOfLines(){
    return document.getElementById("textarea-editor").value.split("\n").length;
}


const tx = document.getElementById("textarea-editor")
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
  
  tx[i].addEventListener("input", OnInput, false);
}
//initialize the console resizer div
let resizer = document.getElementById("console-resizer");
resizer.addEventListener('mousedown', initResize, false);
function OnInput() {
  this.style.height = 'auto';
  
  this.style.height = (this.scrollHeight) + 'px';
}


export function switchBreakpoint(index) {
    let classNameArray = ["point"];
    let point = document.getElementById(index)
    let state = point.className.split(" ")[1];
    if(state === "inactive"){
        classNameArray.push("active");
        breakpoints.push(parseInt(index));
    }else if(state === "active"){
        classNameArray.push("inactive");
        let pointIndex = breakpoints.indexOf(parseInt(index));
        breakpoints.splice(pointIndex, 1);
    }
    
    point.className = classNameArray.join(" ");
    
    
    
}
export function updateEditorMargin(){
    let currentLineNum = getNumberOfLines();
    if (currentLineNum === lastLinesNum){
        return
    }
    while (lastLinesNum < currentLineNum){
        
        const divLine = document.createElement("div");
        divLine.className = "line";

        const divPoint = document.createElement("div");
        const buttonTemplate = document.getElementById("pointtemplate").lastElementChild;
        
        divPoint.id = "point";
        
        const divLineNumber = document.createElement("div");
        divLineNumber.className = "linenumber";
        lastLinesNum++;
        divLine.id = `line-${lastLinesNum}`;
        const buttonPoint = buttonTemplate.cloneNode();
        
        buttonPoint.id = lastLinesNum.toString();
        let buttonClassName = buttonPoint.className.split(" ");
        
        // make sure that the button is initialized as inactive
        buttonClassName[1] = "inactive";
        buttonPoint.className = buttonClassName.join(" ");
        divLineNumber.innerHTML = lastLinesNum.toString();
        divPoint.appendChild(buttonPoint);
        divLine.appendChild(divPoint);
        divLine.appendChild(divLineNumber);

        document.getElementById("lines").appendChild(divLine);
        
    }
    while(lastLinesNum > currentLineNum){
        
        const linesContainer = document.getElementById("lines");
        
        lastLinesNum--;
        linesContainer.removeChild(linesContainer.lastElementChild);
        
    }
    lastLinesNum = currentLineNum;

    
}

document.getElementById("textarea-editor").onkeydown = keyboardListenerCallback;
document.getElementById("textarea-editor").addEventListener("input", (event) => {
    
    
    let editor = document.getElementById("textarea-editor");
    
    
    
    if(event.inputType === "deleteContentBackward"){
        updateEditorMargin();
        return;
        
    }
    if(event.inputType === "insertLineBreak"){
        
        updateEditorMargin();
        return;
    }
    
    
    let cursorPos = editor.selectionStart;
    
    editor.setSelectionRange(cursorPos, cursorPos);
    let val = editor.value;
    
    let previousSpacePos = Math.max(
        val.slice(0, cursorPos).lastIndexOf(" "), 
        val.slice(0, cursorPos).lastIndexOf("\n"), 
        val.slice(0, cursorPos).lastIndexOf("\t"));
    if(previousSpacePos === -1){
        previousSpacePos = 0;
    }
    let nextSpacePos = Math.min(
        val.slice(0, cursorPos).lastIndexOf(" "), 
        val.slice(0, cursorPos).lastIndexOf("\n"), 
        val.slice(0, cursorPos).lastIndexOf("\t"));
    if(nextSpacePos === -1){
        nextSpacePos = 0;
    }
    nextSpacePos += cursorPos;
    
    val = val.slice(previousSpacePos, nextSpacePos).trim();
    let matchingWords = []
    for (let word of keywords){
        
        if(/\S/.test(val) && word.substr(0, val.length).toUpperCase() === val.toUpperCase()){
            
            matchingWords.push(word);  
        }
    }
    
    
    let firstHalf = editor.value.slice(0,cursorPos);
    let secondHalf = editor.value.slice(cursorPos);

    
    if (matchingWords.length> 0){
        let autoFillPart = matchingWords[0].slice(val.length);
        
        firstHalf += autoFillPart;
        editor.value = firstHalf + secondHalf;
        
        
        editor.setSelectionRange(cursorPos, cursorPos + autoFillPart.length);
        document.getElementById("textarea-editor").focus;
        
    }  
    else{
        editor.setSelectionRange(cursorPos, cursorPos);
        
    }
    
    
    
    
})

function getFirstCharIndexInCurrentLine(start){
    let editor = document.getElementById("textarea-editor");
    let firstCharIndex = editor.value.substring(0, start).lastIndexOf("\n") + 1;
    return firstCharIndex;
}
function keyboardListenerCallback(event){
    updateEditorMargin();
    let editor = document.getElementById("textarea-editor");
    let end = editor.selectionEnd;
    let start = editor.selectionStart;
    
    

    if(event.key === "Tab"){
        event.preventDefault();
        
        
        
        if(start === end){
            let tabOffset  = (start- getFirstCharIndexInCurrentLine(start)) % 4
            
            if (tabOffset === 0){
                
                editor.value = editor.value.substring(0, start) + "\t" + editor.value.substring(end);
            
                editor.selectionEnd = editor.selectionStart = start + 1;
            }
            else {
                
                editor.value = editor.value.substring(0, start) + " ".repeat(4) + editor.value.substring(end);
                editor.selectionEnd = editor.selectionStart = start + 4;
            }
            
            
        }
        else {
            

            editor.selectionStart = editor.selectionEnd;
        }

    }

}


function getContent(){
    document.getElementById("textarea-editor").value = document.getElementById("textarea-editor").innerHTML.replace(/[<>]/g,"");
}


// resizing console
function initResize(e) {
    window.addEventListener('mousemove', Resize, false);
    window.addEventListener('mouseup', stopResize, false);
 }


 function Resize(e) {
    let consoleElement = document.getElementById("textarea-console");
    
    let inputTapeElement = document.getElementById("input-tape");
    let consoleUpperEdgePosition = Math.round(consoleElement.getBoundingClientRect().top);
    let consoleElementHeight = consoleElement.style.height
    
    if(consoleElementHeight){
        consoleElementHeight = parseInt(consoleElementHeight, 10);
    } else {
        consoleElementHeight = consoleElement.clientHeight;
    
    }
        
    
    let newHeight = consoleElementHeight + consoleUpperEdgePosition - e.clientY;
    
    let container = document.getElementById("workspace");
    
    if(consoleElement.getBoundingClientRect().top - inputTapeElement.getBoundingClientRect().bottom < 80){
        
        container.style.display = "none";
    }
    else{
        
        container.style.display = "block";
    }
    
    consoleElement.style.height = newHeight.toString() + 'px';
    
    
 }
 
//on mouseup remove windows functions mousemove & mouseup
function stopResize(e) {
    
    window.removeEventListener('mousemove', Resize, false);
    window.removeEventListener('mouseup', stopResize, false);
    
}

function appendCellToTape(type, tape){
    let oldContainerId = `${type}put-tape-container`;
        
        let newCell = document.getElementById(oldContainerId).lastElementChild.cloneNode(true);
        let idSplit = newCell.id.split("-");
        let newIndex = parseInt(idSplit[1]) + 1;
        let newContainerId = `${idSplit[0]}-${newIndex}`;
        newCell.id = newContainerId;
        newCell.lastElementChild.innerHTML = newIndex.toString();
        tape.appendChild(newCell);
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
    
    if(secondToLastCellIsVisible(type)){
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
    document.getElementById(currentId).classList.toggle("show");
}

function secondToLastCellIsVisible(type){
    let lastElement;
    if (type === "in"){
        lastElement = document.getElementById("input-tape-container").lastElementChild.previousElementSibling;
    }
    else if (type == "out"){
        lastElement = document.getElementById("output-tape-container").lastElementChild.previousElementSibling;
    }
    
    
    return (lastElement.getBoundingClientRect().left >=0 && lastElement.getBoundingClientRect().right <= window.innerWidth);
}

window.onclick = function(event) {
    // if (event.target.matches('.tool')!event.target.matches('.options')){
        let dropdowns = document.getElementsByClassName('dropdown-content');
        
        for (let openDropdown of dropdowns){
            if (openDropdown.classList.contains('show')){
                openDropdown.classList.remove('show');
            }
        }
    // }
}

setColorTheme();