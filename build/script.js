let lastLinesNum = 1;
let breakpoints = [];
function toggleFile(){
    
}
function getNumberOfLines(){
    return document.getElementById("textarea-editor").value.split("\n").length;
}


const tx = document.getElementById("textarea-editor")
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
  
  tx[i].addEventListener("input", OnInput, false);
}

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
    }else if(state === "active"){
        classNameArray.push("inactive");
    }
    point.className = classNameArray.join(" ");
    
    breakpoints[parseInt(index)] = parseInt(index);
    
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