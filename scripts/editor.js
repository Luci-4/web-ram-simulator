import {updateEditorMargin} from './script.js';
import app from './app.js';
import { saveEditorToCookies } from './cookies.js';

function getCurrentFocusedText(){
    let cursorPos = app.editor.selectionStart;
    const whitespaceChars = [
        " ",
        "\n",
        "\t"
    ]
    // editor.setSelectionRange(cursorPos, cursorPos);
    let val = app.editor.value;
    
    let previousSpacePos = Math.max(
        ...whitespaceChars.map(char => {
            return val.slice(0, cursorPos).lastIndexOf(char)
        })
    );

    if(previousSpacePos === -1){
        previousSpacePos = 0;
    }
    
    let nextSpacePos = Math.min(...whitespaceChars
        .map(char => {
            return val.indexOf(char, cursorPos);
        })
        .filter(pos => pos >= 0)
    );
    
    return val.slice(previousSpacePos, nextSpacePos).trim();
}

function getMatchingWords(val){
    let matchingWords = []
    for (let word of app.keywords){
        
        if(/\S/.test(val) && word.substr(0, val.length).toUpperCase() === val.toUpperCase()){
            
            matchingWords.push(word);  
        }
    }

    return matchingWords;
}

function autocomplete(val, matchingWords, cursorPos){
    let firstHalf = app.editor.value.slice(0,cursorPos);
    let secondHalf = app.editor.value.slice(cursorPos);

    let autoFillPart = matchingWords[0].slice(val.length);
    
    firstHalf += autoFillPart;
    app.editor.value = firstHalf + secondHalf;
    
    
    app.editor.setSelectionRange(cursorPos, cursorPos + autoFillPart.length);
    app.editor.focus;
}

export function onEditorInputCallback(event) {
    
    if(event.inputType === "deleteContentBackward" || event.inputType === "insertLineBreak"){
        updateEditorMargin();
        return;
    }

    let cursorPos = app.editor.selectionStart;
    
    let val = getCurrentFocusedText();
    
    let matchingWords = getMatchingWords(val);
    
    if (matchingWords.length > 0){
        autocomplete(val, matchingWords, cursorPos);
    } 

    else{
        app.editor.setSelectionRange(cursorPos, cursorPos);
        
    }   
}

function getFirstCharIndexInCurrentLine(start){
    let firstCharIndex = app.editor.value.substring(0, start).lastIndexOf("\n") + 1;
    return firstCharIndex;
}

export function keyboardListenerCallback(event){
    updateEditorMargin();
    saveEditorToCookies();    
    let end = app.editor.selectionEnd;
    let start = app.editor.selectionStart;
    
    

    if(event.key === "Tab"){
        event.preventDefault();
        
        if(start === end){
            let lineStartIndex = getFirstCharIndexInCurrentLine(start);

            let tabLineCount = app.editor.value.substring(lineStartIndex, start).split("\t").length - 1;
            
            let tabOffset  = (start - lineStartIndex + 3*tabLineCount) % 4;
            
            
            if (tabOffset === 0){
                
                // fitting /t on the cursor position:
                app.editor.value = app.editor.value.substring(0, start) + "\t" + app.editor.value.substring(end);
                
                // updating cursor position
                app.editor.selectionEnd = app.editor.selectionStart = start + 1;
            }
            else {
                // adding four spaces to get the same indentation size
                app.editor.value = app.editor.value.substring(0, start) + " ".repeat(4) + app.editor.value.substring(end);
                app.editor.selectionEnd = app.editor.selectionStart = start + 4;
            }
        }
        else {

            // cancelling the selection
            app.editor.selectionStart = app.editor.selectionEnd;
        }

    }

}

export function getNumberOfLines(){
    return app.editor.value.split("\n").length;
}

export function OnInput() {
    this.style.height = 'auto';
    
    this.style.height = (this.scrollHeight) + 'px';
}



export function loadEditorContents(cookieObj){
    
    let value = cookieObj["code"];
    app.editor.value = value;
}