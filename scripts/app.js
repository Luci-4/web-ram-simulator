import {Parser} from '../build/parser.js';

const colorThemes = {
    DARK : {
        Editor: "#181818",
        EditorHighlight: "",
        ConsoleBackground: "black",
        EditorTextColor: "",
        ConsoleTextColor: "",
        ButonOnHover: "",
        ToolbarBackground: "#242424",
        TapeCellBackground: "",
        TapeBackground: "",
        TapeButtons: "",
        TapeTextColor: "",
        TapeCaptionColor: "#061027"
    },

    BLUE : {
        // Editor: "#071330",
        Editor: "#040e27",
        EditorHighlight: "#0C4160",
        // CONSOLE: "#09193d",
        ConsoleBackground: "#061027",
        EditorTextColor: "#df9e25",
        ConsoleTextColor: "#C3CEDA",
        ButonOnHover: "",
        ToolbarBackground: "#071330",
        TapeCellBackground: "#0074B7",
        TapeBackground: "#738FA7",
        TapeCaptionsBackground: "#7EC8E3",
        TapeButtons: "#C3CEDA",
        TapeTextColor: "#C3CEDA",
        TapeCaptionColor: "#061027"
    },

    MATRIX : {
        Editor: "black",
        EditorHighlight: "grey",
        ConsoleBackground: "black",
        EditorTextColor: "green",
        ConsoleTextColor: "green",
        ButonOnHover: "",
        ToolbarBackground: "#002400",
        TapeCellBackground: "grey",
        TapeBackground: "red",
        TapeCaptionsBackground:"blue",
        TapeButtons: "green",
        TapeTextColor: "green",
        TapeCaptionColor: "#061027"
    },
    RANDOM : {
        Editor: "black",
        EditorHighlight: "red",
        ConsoleBackground: "purple",
        EditorTextColor: "green",
        ConsoleTextColor: "white",
        ButonOnHover: "#6c757e",
        ToolbarBackground: "#071330",
        TapeCellBackground: "lightblue",
        TapeBackground: "thistle",
        TapeCaptionsBackground: "lightcoral",
        TapeButtons: "blue",
        TapeCaptionColor: "#061027"
    }


}

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