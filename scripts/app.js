import Emulator from '../build/emulator.js';

class App{
    constructor(){
        this.emulator = new Emulator();
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
        this.interval = 5;
    }
    
}

export default new App();