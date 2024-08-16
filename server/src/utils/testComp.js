const vm = require("vm");

function compile(code) {
	code = code.replace(/console\.log\((.*)\)/g, "__output.push($1)");

	try {
		const context = { fn: undefined, __output: [] };
		vm.createContext(context);

		vm.runInContext(
			`
            const IDLE = 0;
            const ATTACK = 1;
            const BLOCK = 2;
            const UPGRADE = 3;
            
            fn = (enemyPrevMove, stats, enemyStats, shortMemory, longMemory) => {
                ${code}
            }
        `,
			context
		);
		return [context.fn, context.__output];
	} catch (err) {
		console.log("Error:", err.message);
		return [undefined, undefined];
	}
}

const [move, output] = compile(`
console.log(12 + "asd");
const returning = 1;
return BLOCK + returning;
`);
if (move) {
	console.log(move(2, 5));
	console.log(output);
}
