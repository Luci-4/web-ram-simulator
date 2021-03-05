import app from './app.js';


export function updateConsole(){
    let debugcon = document.getElementById("console-lines");
    
    for(let message of app.parser.debugConsole){
        debugcon.innerText += message;
        
    }

}


export function clearConsole(){
    let debugcon = document.getElementById("console-lines");
    
    debugcon.innerHTML = "";
    
}

export function initResize(e) {
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