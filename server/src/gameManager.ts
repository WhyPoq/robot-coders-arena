import { Socket } from "socket.io";
import BotInfo from "./types/BotInfo";
import updateBot from "./utils/updateBot";
import BotStats from "./types/BotStats";
import { RobotAction } from "./types/RobotAction";
import { Request } from "express";
import enemyBotsData from "./enemyBots/enemyBotsData.json";

const MAX_STEPS_COUNT = 100;
const NORMAL_PACE_INTERVAL = 2500;
const FAST_PACE_INTERVAL = 250;

export async function startGame(
	socket: Socket,
	moveFn: Function,
	__output: string[],
	enemyMoveFn: Function,
	req: Request
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

	console.log("cur level", req.session.curLevel);

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

	function getMove(fn: Function, botInfo: BotInfo): RobotAction {
		try {
			const returnVal = fn(
				botInfo.shortMemory,
				botInfo.enemyPrevMove,
				botInfo.stats,
				botInfo.enemyStats,
				botInfo.longMemory
			);
			if (typeof returnVal !== "number" || returnVal < 0 || returnVal >= RobotAction.Length)
				return RobotAction.Idle;
			return returnVal as RobotAction;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			socket.emit("consoleLinesError", [message]);
			return RobotAction.Idle;
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

		let botMove = getMove(moveFn!, playerBotInfo);
		if (__output.length > 0) {
			socket.emit("consoleLines", __output);
			while (__output.length > 0) __output.pop();
		}
		let enemyMove = getMove(enemyMoveFn!, enemyBotInfo);

		botMove = updateBot(botMove, enemyMove, playerStats, enemyStats);
		enemyMove = updateBot(enemyMove, botMove, enemyStats, playerStats);

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
			if (req.session.curLevel === undefined) {
				req.session.curLevel = 0;
			}

			let completedAllLevels = false;
			if (req.session.curLevel + 1 < enemyBotsData.length) {
				req.session.curLevel++;
				req.session.save();
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
