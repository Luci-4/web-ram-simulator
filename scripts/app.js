import {Parser} from '../build/parser.js';


class App{
    constructor(){
        this.parser = new Parser();
        this.breakpoints = [];
        this.lastLinesNum = 1;
        this.keywords = [
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
        this.editor = document.getElementById("textarea-editor");
        let decodedCookie = decodeURIComponent(document.cookie);
        let value = decodedCookie.substring("rammachinecode".length);
        this.editor.value = value;
    }
    
}

export default new App();