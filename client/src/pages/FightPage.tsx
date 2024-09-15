import { useState, useEffect, useCallback } from "react";
import { socket } from "../socket";
import CodingUI from "../components/FightPage/CodingUI";
import FightControlBar from "../components/FightPage/FightControlBar";
import { useSceneContext } from "../contexts/SceneContext";
import { RobotAction } from "../types/RobotAction";
import FightUI from "../components/FightPage/FightUI";
import { useConsoleContext } from "../contexts/ConsoleContext";
import ConsoleLine from "../types/ConsoleLine";
import { BotStats, getResetBotStats } from "../types/BotStats";
import { useBotStatsContext } from "../contexts/BotStatsContext";
import { useGameScoreContext } from "../contexts/GameScore";
import { RoundWinner } from "../types/RoundWinner";
import { useUpdateEnemyContext } from "../contexts/UpdateEnemyContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { normalPaceInterval } from "../constants";
import { usePaceContext } from "../contexts/PaceContext";
import useRobots3d from "../hooks/useRobots3d";

const FightPage = () => {
	const [isCodingPhase, setIsCodingPhase] = useState(true);
	const [isPending, setIsPending] = useState(false);
	const [code, setCode] = useLocalStorage("code", "\t// type your code here ");
	const { setLines } = useConsoleContext();
	const { scoreState } = useGameScoreContext();

	const [robotsTriggerActivated, setRobotsTriggerActivated] = useState(true);

	const { robot1Action, robot2Action, setRobot1Action, setRobot2Action } = useSceneContext();
	const { setPlayerStats, setEnemyStats, playerStats, enemyStats } = useBotStatsContext();

	const [showWinner, setShowWinner] = useState("");
	const [gameEnd, setGameEnd] = useState(false);
	const [wonGame, setWonGame] = useState(false);
	const [completedAllLevels, setCompletedAllLevels] = useState(false);

	const { actionInterval, setPace } = usePaceContext();
	const speedUpCoeff = normalPaceInterval / actionInterval;
	const timeScale = actionInterval / normalPaceInterval;

	const { triggerUpdate } = useUpdateEnemyContext();

	useEffect(() => {
		setRobot1Action(RobotAction.Idle);
		setRobot2Action(RobotAction.Idle);
	}, []);

	const resetRound = useCallback(() => {
		setRobot1Action(RobotAction.Idle);
		setRobot2Action(RobotAction.Idle);
		setRobotsTriggerActivated(true);
		setShowWinner("");
		setPlayerStats(getResetBotStats());
		setEnemyStats(getResetBotStats());
	}, [playerStats, enemyStats]);

	const stopGame = useCallback(() => {
		setPace("normal");
		scoreState.reset();
		setGameEnd(false);
		setWonGame(false);
		resetRound();
	}, [resetRound, scoreState]);

	const endGame = useCallback(() => {
		stopGame();
		socket.disconnect();
	}, [resetRound, scoreState]);

	const toggleStartFight = useCallback(() => {
		if (isPending) return;

		if (isCodingPhase) {
			setLines([]);
			setIsPending(true);
			socket.connect();
			socket.emit("startFight", { code: code });
			socket.once("compiledSuccessfully", () => {
				stopGame();
				setIsCodingPhase(false);
				setIsPending(false);
				socket.off("compileError");
			});

			socket.once("compileError", (_errorMessage: string) => {
				socket.off("compiledSuccessfully");
				setIsPending(false);
				endGame();
			});
		} else {
			setIsCodingPhase(true);
			setIsPending(false);
			setPlayerStats(null);
			setEnemyStats(null);
			if (socket.connected) {
				socket.off("compiledSuccessfully");
				socket.off("compileError");
				endGame();
			}
		}
	}, [isCodingPhase, setIsCodingPhase, isPending, setIsPending, code]);

	useEffect(() => {
		function setRobotAction(action: any, setter: (newAction: RobotAction) => void) {
			if (typeof action === "number" && 0 <= action && action < RobotAction.Length) {
				setter(action as RobotAction);
			} else {
				setter(RobotAction.Idle);
			}
		}

		function botActionHadler(
			action1: any,
			action2: any,
			playerStats: BotStats,
			enemyStats: BotStats
		) {
			setRobotAction(action1, setRobot1Action);
			setRobotAction(action2, setRobot2Action);
			setTimeout(() => {
				setPlayerStats(playerStats);
				setEnemyStats(enemyStats);
			}, 1000 * timeScale);
			setRobotsTriggerActivated(true);
		}

		socket.on("botsActions", botActionHadler);

		return () => {
			socket.off("botsActions", botActionHadler);
		};
	}, [
		setRobot1Action,
		setRobot2Action,
		setRobotsTriggerActivated,
		setPlayerStats,
		setEnemyStats,
		speedUpCoeff,
	]);

	useEffect(() => {
		function addConsoleLines(logLines: string[]) {
			const newLines: ConsoleLine[] = logLines.map((logLine) => {
				return { type: "log", value: logLine };
			});
			setLines((prev) => [...prev, ...newLines]);
		}

		function addConsoleLinesError(errorLines: string[]) {
			const newLines: ConsoleLine[] = errorLines.map((errorLine) => {
				return { type: "error", value: errorLine };
			});
			setLines((prev) => [...prev, ...newLines]);
		}

		socket.on("consoleLines", addConsoleLines);
		socket.on("consoleLinesError", addConsoleLinesError);
		return () => {
			socket.off("consoleLines", addConsoleLines);
			socket.off("consoleLinesError", addConsoleLinesError);
		};
	}, [setLines]);

	useEffect(() => {
		function roundEndHandler({ winner }: { winner: RoundWinner }) {
			scoreState.addRound(winner);
			if (winner === "player") {
				setShowWinner("You won the round");
				setRobot1Action(RobotAction.Idle);
				setRobot2Action(RobotAction.Die);
			} else if (winner === "enemy") {
				setShowWinner("You lost the round");
				setRobot1Action(RobotAction.Die);
				setRobot2Action(RobotAction.Idle);
			} else {
				setShowWinner("The round is a draw");
				setRobot2Action(RobotAction.Idle);
				setRobot2Action(RobotAction.Idle);
			}

			setRobotsTriggerActivated(true);
			setTimeout(resetRound, 4000);
		}

		socket.on("roundEnd", roundEndHandler);
		return () => {
			socket.off("roundEnd", roundEndHandler);
		};
	}, [
		scoreState,
		setShowWinner,
		setRobot1Action,
		setRobot2Action,
		setShowWinner,
		setRobotsTriggerActivated,
	]);

	useEffect(() => {
		function gameEndHandler({
			winner,
			roundWinner,
			completedAllLevels,
		}: {
			winner: RoundWinner;
			roundWinner: RoundWinner;
			completedAllLevels: boolean;
		}) {
			scoreState.addRound(roundWinner);
			if (winner === "player") {
				setShowWinner("You won the game");
				setRobot1Action(RobotAction.Idle);
				setRobot2Action(RobotAction.Die);
				triggerUpdate();
				setWonGame(true);
			} else if (winner === "enemy") {
				setShowWinner("You lost the game");
				setRobot1Action(RobotAction.Die);
				setRobot2Action(RobotAction.Idle);
			} else {
				setShowWinner("The game ended in a draw");
				setRobot2Action(RobotAction.Idle);
				setRobot2Action(RobotAction.Idle);
			}
			setGameEnd(true);
			setRobotsTriggerActivated(true);
			if (completedAllLevels) {
				setCompletedAllLevels(true);
			}
		}

		socket.on("gameEnd", gameEndHandler);
		return () => {
			socket.off("gameEnd", gameEndHandler);
		};
	}, [
		scoreState,
		setShowWinner,
		setRobot1Action,
		setRobot2Action,
		triggerUpdate,
		setGameEnd,
		setRobotsTriggerActivated,
		setCompletedAllLevels,
	]);

	useEffect(() => {
		return () => {
			if (socket.connected) socket.disconnect();
		};
	}, []);

	useRobots3d(robot1Action, robot2Action, robotsTriggerActivated, setRobotsTriggerActivated);

	return (
		<div className="h-full text-white relative pb-4 overflow-hidden z-0 flex flex-col pointer-events-none no-pointer-events-children">
			<FightControlBar
				isCodingPhase={isCodingPhase}
				toggleStartFight={toggleStartFight}
				isPending={isPending}
			/>
			<div className="flex-grow grid z-10">
				<div className="col-start-1 row-start-1">
					<CodingUI show={isCodingPhase} code={code} setCode={setCode} />
				</div>
				<div className="col-start-1 row-start-1">
					<FightUI
						show={!isCodingPhase}
						showWinner={showWinner}
						gameEnd={gameEnd}
						wonGame={wonGame}
						endGame={endGame}
						completedAllLevels={completedAllLevels}
						setCompletedAllLevels={setCompletedAllLevels}
						toggleStartFight={toggleStartFight}
					/>
				</div>
			</div>
		</div>
	);
};

export default FightPage;
