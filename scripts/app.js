import {Parser} from '../build/parser.js';


class App{
    constructor(){
        this.parser = new Parser();
        this.colorTheme = colorThemes["BLUE"];
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
    }
    setColorTheme(key){
        this.colorTheme = colorThemes[key];
    }
}

export default new App();