import { DuplicateLabelsError, Error_ } from "./exceptions.js";
import {Token} from "./token.js";

abstract class Label extends Token{
    id: string | undefined;
    public static Generate(text: string | undefined): Label {
        if (typeof text === "undefined"){
            return new NullLabel(text);
        }
        return new PopulatedLabel(text);
    }
    protected abstract validateUniqueness(labelIds: Array<string | undefined>): boolean;

    parseValidate(lineIndex: number, labelIds: Array<string | undefined>): [boolean, Error_[]]{
        const errors: Error_[] = []
        let status = true;
        if(!this.validateUniqueness(labelIds)){
            errors.push(new DuplicateLabelsError(lineIndex, this))
            status = false
        }
        
        return [status, errors]
    }
}

class NullLabel extends Label{
    id: undefined;

    constructor(text: undefined = undefined){
        super();
        this.id = text;
    }

    protected validateUniqueness(labelsIds: Array<string | undefined>){
        return true;
    }
}

class PopulatedLabel extends Label{
    id: string;

    constructor(text: string){
        super();
        this.id = text;
    }
    protected validateUniqueness(labelIds: Array<string | undefined>){
        const filteredIds = labelIds.filter((id: string | undefined) => typeof id !== "undefined")
        return !(filteredIds.includes(this.id))
    }
}

export {Label, PopulatedLabel,NullLabel};