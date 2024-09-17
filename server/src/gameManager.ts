import { Socket } from "socket.io";
import BotInfo from "./types/BotInfo";
import updateBot from "./utils/updateBot";
import BotStats from "./types/BotStats";
import { RobotAction } from "./types/RobotAction";
import { CurLevelRequest } from "./utils/extractCurLevel";
import enemyBotsData from "./enemyBots/enemyBotsData.json";
import { FunctionFromSeclang, sandboxRun, seclangValueToJS } from "seclang/sandbox";
import { SeclangFunction, SeclangList, SeclangStdout, SeclangValue } from "seclang/core";

const MAX_STEPS_COUNT = 100;
const NORMAL_PACE_INTERVAL = 2500;
const FAST_PACE_INTERVAL = 250;

export async function startGame(
	socket: Socket,
	moveFn: SeclangFunction,
	enemyMoveFn: SeclangFunction,
	req: CurLevelRequest
) {
	let gameStepInterval: NodeJS.Timeout | undefined = undefined;
	const playerStats = new BotStats();
	const enemyStats = new BotStats();

	const playerBotInfo = new BotInfo(playerStats, enemyStats);
	const enemyBotInfo = new BotInfo(enemyStats, playerStats);

	let roundCount = 0;
	let playerWins = 0;
	let enemyWins = 0;

	let stepsCount = 0;

	let stepWaitTime = NORMAL_PACE_INTERVAL;

	function changePace(newPace: "normal" | "fast") {
		if (newPace === "normal") {
			stepWaitTime = NORMAL_PACE_INTERVAL;
		} else if (newPace === "fast") {
			stepWaitTime = FAST_PACE_INTERVAL;
		}

		if (gameStepInterval) {
			clearInterval(gameStepInterval);
			gameStep();
			gameStepInterval = setInterval(() => {
				gameStep();
			}, stepWaitTime);
		}
	}

	function getMove(fn: SeclangFunction, botInfo: BotInfo): [RobotAction, string[]] {
		try {
			const codeCompileResult = sandboxRun(
				"move(shortMemory, enemyPrevMove, longMemory)",
				{ maxInstructions: 1000000, maxVariables: 1000 },
				10,
				"<robot_code>",
				{
					ATTACK: 1,
					BLOCK: 2,
					UPGRADE: 3,
					move: fn,
					shortMemory: botInfo.shortMemory,
					enemyPrevMove: botInfo.enemyPrevMove,
					longMemory: botInfo.longMemory,
				}
			);

			const returnVal = seclangValueToJS(codeCompileResult.result);

			function forceSeclangNumsToJsArray(jsArray: number[], seclangNums: SeclangList) {
				const convertedNums = seclangValueToJS(seclangNums);
				for (let i = 0; i < jsArray.length; i += 1) {
					if (i < convertedNums.length && typeof convertedNums[i] === "number") {
						jsArray[i] = convertedNums[i] as number;
					} else {
						jsArray[i] = 0;
					}
				}
			}

			forceSeclangNumsToJsArray(
				botInfo.shortMemory,
				codeCompileResult.globalSymbols["shortMemory"] as SeclangList
			);
			forceSeclangNumsToJsArray(
				botInfo.longMemory,
				codeCompileResult.globalSymbols["longMemory"] as SeclangList
			);

			if (typeof returnVal !== "number" || returnVal < 0 || returnVal >= RobotAction.Length)
				return [RobotAction.Idle, codeCompileResult.stdout];
			return [returnVal as RobotAction, codeCompileResult.stdout];
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			socket.emit("consoleLinesError", [message]);
			return [RobotAction.Idle, []];
		}
	}

	function gameStep() {
		if (playerStats.health <= 0 || enemyStats.health <= 0) {
			endRound();
			return;
		}

		stepsCount++;
		if (stepsCount > MAX_STEPS_COUNT) {
			endRound();
			return;
		}

		let [botMove, stdout] = getMove(moveFn!, playerBotInfo);
		if (stdout.length > 0) {
			socket.emit("consoleLines", stdout);
		}
		let [enemyMove, _enemyStdout] = getMove(enemyMoveFn!, enemyBotInfo);

		const oldPlayerStats = playerStats.copy();
		const oldEnemyStats = enemyStats.copy();
		botMove = updateBot(botMove, enemyMove, playerStats, oldEnemyStats);
		enemyMove = updateBot(enemyMove, botMove, enemyStats, oldPlayerStats);

		playerBotInfo.enemyPrevMove = enemyMove;
		enemyBotInfo.enemyPrevMove = botMove;

		socket.emit("botsActions", botMove, enemyMove, playerBotInfo.stats, enemyBotInfo.stats);
	}

	function startRound() {
		resetRound();

		roundCount++;

		gameStep();
		gameStepInterval = setInterval(() => {
			gameStep();
		}, stepWaitTime);
	}

	function endRound() {
		stopRound();

		let roundWinner = "tie";
		if (playerStats.health <= 0 || enemyStats.health <= 0) {
			if (playerStats.health > enemyStats.health) {
				roundWinner = "player";
				playerWins++;
			} else if (playerStats.health < enemyStats.health) {
				roundWinner = "enemy";
				enemyWins++;
			}
		}

		if (playerWins === 2 || enemyWins === 2 || roundCount === 3) {
			endGame(roundWinner);
			return;
		}

		if (roundWinner === "player") {
			socket.emit("roundEnd", { winner: "player" });
		} else if (roundWinner === "enemy") {
			socket.emit("roundEnd", { winner: "enemy" });
		} else {
			socket.emit("roundEnd", { winner: "tie" });
		}

		setTimeout(startRound, 5000);
	}

	function stopRound() {
		if (gameStepInterval) {
			clearInterval(gameStepInterval);
			gameStepInterval = undefined;
		}
	}

	function resetRound() {
		stepsCount = 0;
		playerBotInfo.shortMemory = new Array(10).fill(0);
		enemyBotInfo.shortMemory = new Array(10).fill(0);
		playerBotInfo.enemyPrevMove = -1;
		enemyBotInfo.enemyPrevMove = -1;
		playerStats.reset();
		enemyStats.reset();
	}

	async function endGame(roundWinner: string) {
		if (playerWins === 2) {
			let completedAllLevels = false;
			if (req.curLevel + 1 < enemyBotsData.length) {
				try {
					await req.setCurLevel(req.curLevel + 1);
				} catch (err) {
					console.error(err);
					socket.disconnect();
				}
			} else {
				completedAllLevels = true;
			}
			socket.emit("gameEnd", { winner: "player", roundWinner, completedAllLevels });
		} else if (enemyWins === 2) {
			socket.emit("gameEnd", { winner: "enemy", roundWinner, completedAllLevels: false });
		} else {
			socket.emit("gameEnd", { winner: "tie", roundWinner, completedAllLevels: false });
		}
		stopGame();
	}

	function stopGame() {
		socket.off("changePace", changePace);
		stopRound();
	}

	socket.on("changePace", changePace);

	socket.on("disconnect", () => {
		stopGame();
	});

	startRound();
}
