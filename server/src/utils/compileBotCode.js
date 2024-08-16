"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vm_1 = __importDefault(require("vm"));
function compileBotCode(code) {
    code = code.replace(/console\.log\((.*)\)/g, "__output.push($1)");
    try {
        const context = {
            fn: undefined,
            __output: [],
        };
        vm_1.default.createContext(context);
        vm_1.default.runInContext(`
            const IDLE = 0;
            const ATTACK = 1;
            const BLOCK = 2;
            const UPGRADE = 3;
            
            fn = (shortMemory, enemyPrevMove, stats, enemyStats, longMemory) => {
                ${code}
            }
        `, context);
        return { status: "success", fn: context.fn, __output: context.__output };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { status: "fail", message };
    }
}
exports.default = compileBotCode;
//# sourceMappingURL=compileBotCode.js.map