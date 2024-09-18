"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("seclang/core");
const sandbox_1 = require("seclang/sandbox");
function compileBotCode(code) {
    const wholeCode = `\
	let IDLE = 0;
	let ATTACK = 1;
	let BLOCK = 2;
	let UPGRADE = 3;
	
	function (shortMemory, enemyPrevMove, longMemory) {
		${code}
	}
`;
    try {
        const codeCompileResult = (0, sandbox_1.sandboxRun)(wholeCode, { maxInstructions: 1000000, maxVariables: 1000 }, 10, "<robot_code>");
        const compiledFunction = codeCompileResult.result;
        return { status: "success", fn: compiledFunction };
    }
    catch (err) {
        let message = "";
        if (err instanceof core_1.InstructionLimitReachedError) {
            message = "Too many instruction";
        }
        else if (err instanceof core_1.VarsLimitReachedError) {
            message = "Too many variables";
        }
        else if (err instanceof sandbox_1.CodeError) {
            message = "\n" + err.message;
        }
        else
            throw err;
        return { status: "fail", message };
    }
}
exports.default = compileBotCode;
//# sourceMappingURL=compileBotCode.js.map