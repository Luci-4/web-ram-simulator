import {App} from './main.js';
let app = new App();


let lastLinesNum = 1;
let breakpoints = [];

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
    let debugcon = document.getElementById("textarea-console");
    for(let message of app.debugConsole){
        debugcon.innerHTML += message;
        console.log(message);
    }

}
function clearConsole(){
    let debugcon = document.getElementById("textarea-console");
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

function changeIconToStop(type){

    let icon = document.getElementById(`${type}-icon`);
    let button = document.getElementById(`${type}-button`);

    icon.src = "/images/stop-icon.png";
    button.onclick = `import('/build/script.js').then(o => o.stop(${type})`
    
}

function changeIconBackToRunControl(type){
    let icon = document.getElementById(`${type}-icon`);
    let button = document.getElementById(`${type}-button`);

    icon.src = `/images/${type}-icon.png`;
    button.onclick = `import('/build/script.js').then(o => o.${type}()`
}

export function stop(type){

}

export function run() {
    clearConsole();
    // changeIconToStop("run");
    let program = document.getElementById("textarea-editor").value;
    getInputs();
    app.run(program, getInputs())
    console.log("program after running");
    updateConsole();
    updateOutputTape();
    // changeIconBackToRunControl("run");
    
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
function updateEditorMargin(){
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
        editor.setSelectionRange(cursorPos, cursorPos + val.length);
    }
    
    
})

function getFirstCharIndexInCurrentLine(start){
    let editor = document.getElementById("textarea-editor");
    let firstCharIndex = editor.value.substring(0, start).lastIndexOf("\n") + 1;
    return firstCharIndex;
}
function keyboardListenerCallback(event){
    
    
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