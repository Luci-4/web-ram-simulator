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
        this.inputTape = document.getElementById("input-tape-container");
        this.outputTape = document.getElementById("output-tape-container");
    }
    
}

export default new App();