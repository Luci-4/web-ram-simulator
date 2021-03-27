import app from './app.js';

function saveCookies(name, value){
    let today = new Date();
    let expiry = new Date(today.getTime() + 30 * 24 * 3600 * 1000); // plus 30 days
    document.cookie=name + "=" + escape(value) + "; path=/; expires=" + expiry.toGMTString();
}
export function saveEditorToCookies(){
    
    saveCookies("code", app.editor.value);
    
}

export function saveInputsToCookies(inputs){
    console.log(inputs);
    let inputsStr = JSON.stringify(inputs);
    saveCookies("inputs", inputsStr);
}

export function getCookieObj(){
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieObj = {};
    decodedCookie.split("; ").forEach(e => {
        let currentIndex = e.indexOf("=");
        let key = e.substring(0, currentIndex);
        cookieObj[key] = e.substring(currentIndex+1);
    });
    return cookieObj;
}


export function getInputValues(cookieObj){
    
    let inputs = cookieObj["inputs"]
        .replace(/\[/g, '')
        .replace(/\]/g, '')
        .split(",")
        .map(e=>{
            return parseInt(e);
        })
    return inputs
}