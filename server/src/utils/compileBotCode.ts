import { InstructionLimitReachedError, SeclangFunction, VarsLimitReachedError } from "seclang/core";
import { CodeError, sandboxRun, seclangValueToJS } from "seclang/sandbox";
import { FunctionFromSeclang } from "seclang/sandbox";

interface CompileResultSuccess {
	status: "success";
	fn: SeclangFunction;
}

interface CompileResultFail {
	status: "fail";
	message: string;
}

type CompileResult = CompileResultSuccess | CompileResultFail;

function compileBotCode(code: string): CompileResult {
	const wholeCode = `\
let ATTACK = 1;
let BLOCK = 2;
let UPGRADE = 3;

function (shortMemory, enemyPrevMove, longMemory) {
${code}
}
`;

	try {
		const codeCompileResult = sandboxRun(
			wholeCode,
			{ maxInstructions: 1000000, maxVariables: 1000 },
			10,
			"<robot_code>"
		);

		const compiledFunction = codeCompileResult.result as SeclangFunction;
		return { status: "success", fn: compiledFunction };
	} catch (err) {
		let message = "";
		if (err instanceof InstructionLimitReachedError) {
			message = "Too many instruction";
		} else if (err instanceof VarsLimitReachedError) {
			message = "Too many variables";
		} else if (err instanceof CodeError) {
			message = "\n" + err.message;
		} else throw err;

		return { status: "fail", message };
	}
}

export default compileBotCode;
