"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGame = void 0;
const BotInfo_1 = __importDefault(require("./types/BotInfo"));
const updateBot_1 = __importDefault(require("./utils/updateBot"));
const BotStats_1 = __importDefault(require("./types/BotStats"));
const RobotAction_1 = require("./types/RobotAction");
const enemyBotsData_json_1 = __importDefault(require("./enemyBots/enemyBotsData.json"));
const sandbox_1 = require("seclang/sandbox");
const MAX_STEPS_COUNT = 100;
const NORMAL_PACE_INTERVAL = 2500;
const FAST_PACE_INTERVAL = 250;
function startGame(socket, moveFn, enemyMoveFn, req) {
    return __awaiter(this, void 0, void 0, function* () {
        let gameStepInterval = undefined;
        const playerStats = new BotStats_1.default();
        const enemyStats = new BotStats_1.default();
        const playerBotInfo = new BotInfo_1.default(playerStats, enemyStats);
        const enemyBotInfo = new BotInfo_1.default(enemyStats, playerStats);
        let roundCount = 0;
        let playerWins = 0;
        let enemyWins = 0;
        let stepsCount = 0;
        let stepWaitTime = NORMAL_PACE_INTERVAL;
        function changePace(newPace) {
            if (newPace === "normal") {
                stepWaitTime = NORMAL_PACE_INTERVAL;
            }
            else if (newPace === "fast") {
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
        function getMove(fn, botInfo) {
            try {
                const codeCompileResult = (0, sandbox_1.sandboxRun)("move(shortMemory, enemyPrevMove, longMemory)", { maxInstructions: 1000000, maxVariables: 1000 }, 10, "<robot_code>", {
                    ATTACK: 1,
                    BLOCK: 2,
                    UPGRADE: 3,
                    move: fn,
                    shortMemory: botInfo.shortMemory,
                    enemyPrevMove: botInfo.enemyPrevMove,
                    longMemory: botInfo.longMemory,
                });
                const returnVal = (0, sandbox_1.seclangValueToJS)(codeCompileResult.result);
                function forceSeclangNumsToJsArray(jsArray, seclangNums) {
                    const convertedNums = (0, sandbox_1.seclangValueToJS)(seclangNums);
                    for (let i = 0; i < jsArray.length; i += 1) {
                        if (i < convertedNums.length && typeof convertedNums[i] === "number") {
                            jsArray[i] = convertedNums[i];
                        }
                        else {
                            jsArray[i] = 0;
                        }
                    }
                }
                forceSeclangNumsToJsArray(botInfo.shortMemory, codeCompileResult.globalSymbols["shortMemory"]);
                forceSeclangNumsToJsArray(botInfo.longMemory, codeCompileResult.globalSymbols["longMemory"]);
                if (typeof returnVal !== "number" || returnVal < 0 || returnVal >= RobotAction_1.RobotAction.Length)
                    return [RobotAction_1.RobotAction.Idle, codeCompileResult.stdout];
                return [returnVal, codeCompileResult.stdout];
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                socket.emit("consoleLinesError", [message]);
                return [RobotAction_1.RobotAction.Idle, []];
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
            let [botMove, stdout] = getMove(moveFn, playerBotInfo);
            if (stdout.length > 0) {
                socket.emit("consoleLines", stdout);
            }
            let [enemyMove, _enemyStdout] = getMove(enemyMoveFn, enemyBotInfo);
            const oldPlayerStats = playerStats.copy();
            const oldEnemyStats = enemyStats.copy();
            botMove = (0, updateBot_1.default)(botMove, enemyMove, playerStats, oldEnemyStats);
            enemyMove = (0, updateBot_1.default)(enemyMove, botMove, enemyStats, oldPlayerStats);
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
                }
                else if (playerStats.health < enemyStats.health) {
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
            }
            else if (roundWinner === "enemy") {
                socket.emit("roundEnd", { winner: "enemy" });
            }
            else {
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
        function endGame(roundWinner) {
            return __awaiter(this, void 0, void 0, function* () {
                if (playerWins === 2) {
                    let completedAllLevels = false;
                    if (req.curLevel + 1 < enemyBotsData_json_1.default.length) {
                        try {
                            yield req.setCurLevel(req.curLevel + 1);
                        }
                        catch (err) {
                            console.error(err);
                            socket.disconnect();
                        }
                    }
                    else {
                        completedAllLevels = true;
                    }
                    socket.emit("gameEnd", { winner: "player", roundWinner, completedAllLevels });
                }
                else if (enemyWins === 2) {
                    socket.emit("gameEnd", { winner: "enemy", roundWinner, completedAllLevels: false });
                }
                else {
                    socket.emit("gameEnd", { winner: "tie", roundWinner, completedAllLevels: false });
                }
                stopGame();
            });
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
    });
}
exports.startGame = startGame;
//# sourceMappingURL=gameManager.js.map