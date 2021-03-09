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
