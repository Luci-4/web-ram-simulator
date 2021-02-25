import {Token} from "./token";

class Label extends Token{
    id: string | undefined;
    constructor(text: string | undefined){
        super();
        this.id = text;
    }
}

export {Label};