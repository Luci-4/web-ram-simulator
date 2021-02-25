"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Label = void 0;
var token_1 = require("./token");
var Label = /** @class */ (function (_super) {
    __extends(Label, _super);
    function Label(text) {
        var _this = _super.call(this) || this;
        _this.id = text;
        return _this;
    }
    return Label;
}(token_1.Token));
exports.Label = Label;
//# sourceMappingURL=label.js.map