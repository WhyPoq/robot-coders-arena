import vm from "vm";

interface CompileResultSuccess {
	status: "success";
	fn: Function;
	__output: string[];
}

interface CompileResultFail {
	status: "fail";
	message: string;
}

type CompileResult = CompileResultSuccess | CompileResultFail;

function compileBotCode(code: string): CompileResult {
	code = code.replace(/console\.log\((.*)\)/g, "__output.push($1)");

	try {
		const context: { fn: Function | undefined; __output: string[] } = {
			fn: undefined,
			__output: [],
		};
		vm.createContext(context);

		vm.runInContext(
			`
            const IDLE = 0;
            const ATTACK = 1;
            const BLOCK = 2;
            const UPGRADE = 3;
            
            fn = (shortMemory, enemyPrevMove, stats, enemyStats, longMemory) => {
                ${code}
            }
        `,
			context
		);
		return { status: "success", fn: context.fn!, __output: context.__output };
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return { status: "fail", message };
	}
}

export default compileBotCode;
