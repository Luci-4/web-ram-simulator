import { DuplicateLabelsError } from "./exceptions.js";
import { Token } from "./token.js";
class Label extends Token {
    static Generate(text) {
        if (typeof text === "undefined") {
            return new NullLabel(text);
        }
        return new PopulatedLabel(text);
    }
    validate(lineIndex, labelIds) {
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
    constructor(text) {
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
        if (filteredIds.includes(this.id)) {
            return false;
        }
        return true;
    }
}
export { Label, PopulatedLabel };
//# sourceMappingURL=label.js.map