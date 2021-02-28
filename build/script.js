let lastLinesNum = 1;
let breakpoints = [];

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


function switchBreakpoint(index) {
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
function updateEditorMargin(currentLineNum){
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

    
}
window.addEventListener('load', function(){
    document.getElementById('textarea').setAttribute('contenteditable', 'true');
    
});
document.getElementById("textarea-editor").addEventListener("input", (event) => {
    
    let linesNum = getNumberOfLines();

    // if number of lines changed
    if(linesNum != lastLinesNum){
        updateEditorMargin(linesNum);
    }
    lastLinesNum = linesNum;
})


function getContent(){
    document.getElementById("textarea-editor").value = document.getElementById("textarea-editor").innerHTML;
}

function save() {
    getContent();
    document.getElementById("save").submit();
    }


function run() {
    let program = document.getElementById("codeeditor").value
    
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

function moveTapeRight(type){
    
    let tape;
    if(type === "in"){
        
        tape = document.getElementById("input-tape-container");
    }
    else if (type === "out"){
        tape = document.getElementById("output-tape-container");
    }
    
    
    let scrollStep = tape.clientWidth / 10;
    
    if(secondToLastCellIsVisible(type)){
        let oldContainerId = `${type}put-tape-container`;
        
        let newCell = document.getElementById(oldContainerId).lastElementChild.cloneNode(true);
        let idSplit = newCell.id.split("-");
        let newIndex = parseInt(idSplit[1]) + 1;
        let newContainerId = `${idSplit[0]}-${newIndex}`;
        newCell.id = newContainerId;
        newCell.lastElementChild.innerHTML = newIndex.toString();
        tape.appendChild(newCell);
    }
    tape.scrollLeft += scrollStep;
}

function moveTapeLeft(type){
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