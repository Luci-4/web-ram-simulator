import { DuplicateLabelsError } from "./exceptions.js";
import { Token } from "./token.js";
class Label extends Token {
    static Generate(text) {
        if (typeof text === "undefined") {
            return new NullLabel(text);
        }
        return new PopulatedLabel(text);
    }
    parseValidate(lineIndex, labelIds) {
        const errors = [];
        let status = true;
        if (!this.validateUniqueness(labelIds)) {
            errors.push(new DuplicateLabelsError(lineIndex, this));
            status = false;
        }
        return [status, errors];
    }
}
class NullLabel extends Label {
    constructor(text = undefined) {
        super();
        this.id = text;
    }
    validateUniqueness(labelsIds) {
        return true;
    }
}
class PopulatedLabel extends Label {
    constructor(text) {
        super();
        this.id = text;
    }
    validateUniqueness(labelIds) {
        const filteredIds = labelIds.filter((id) => typeof id !== "undefined");
        return !(filteredIds.includes(this.id));
    }
}
export { Label, PopulatedLabel, NullLabel };
//# sourceMappingURL=label.js.map