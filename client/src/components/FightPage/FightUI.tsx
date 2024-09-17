import { useBotStatsContext } from "../../contexts/BotStatsContext";
import BotInfo from "./BotInfo";
import Console from "./Console";
import RoundCounter from "./roundCounter/RoundCounter";
import { useCallback, useEffect, useState } from "react";
import { serverUrl } from "../../constants";
import { useUpdateEnemyContext } from "../../contexts/UpdateEnemyContext";
import NormalButton from "./NormalButton";

interface FightUIProps {
	show: boolean;
	showWinner: string;
	gameEnd: boolean;
	wonGame: boolean;
	endGame: () => void;
	completedAllLevels: boolean;
	setCompletedAllLevels: (newVal: boolean) => void;
	toggleStartFight: () => void;
}

async function resetLevel() {
	try {
		const response = await fetch(serverUrl + "/enemyBots/resetLevel", {
			credentials: "include",
		});
		if (!response.ok) {
			const errorMessage = await response.text();
			throw `response status is ${response.status} (not okay): ${errorMessage}`;
		}
	} catch (e) {
		console.error("Error while reseting level:", e);
	}
}

const FightUI = ({
	show,
	showWinner,
	gameEnd,
	wonGame,
	endGame,
	completedAllLevels,
	setCompletedAllLevels,
	toggleStartFight,
}: FightUIProps) => {
	const { playerStats, enemyStats } = useBotStatsContext();
	const { triggerUpdate } = useUpdateEnemyContext();
	const [showWinnerBefore, setShowWinnerBefore] = useState(showWinner);

	useEffect(() => {
		if (showWinner !== "") {
			setShowWinnerBefore(showWinner);
		}
	}, [showWinner]);

	const resetGame = useCallback(() => {
		async function innerFunction() {
			await resetLevel();
			setCompletedAllLevels(false);
			endGame();
			toggleStartFight();
			triggerUpdate();
		}
		innerFunction();
	}, [endGame]);

	const endLevel = useCallback(() => {
		endGame();
		toggleStartFight();
	}, [endGame, toggleStartFight]);

	return (
		<div className="h-full flex flex-col justify-between items-center relative">
			<div className="w-full flex flex-col items-center">
				<div className="flex justify-between items-start w-full pointer-events-children">
					<BotInfo
						side={"left"}
						show={show}
						botStats={playerStats}
						name="You"
						shape="square"
					/>
					<RoundCounter show={show} />
					<BotInfo
						side={"right"}
						show={show}
						botStats={enemyStats}
						name="Enemy"
						shape="triangle"
					/>
				</div>
				<div
					className={[
						"mt-10 p-8 rounded bg-black bg-opacity-80 transition-opacity duration-500 flex flex-col items-center gap-4",
						showWinner === "" ? "opacity-0" : "opacity-100 pointer-events-children",
					].join(" ")}
				>
					<p className="font-bold text-3xl text-center">{showWinnerBefore}</p>
					{gameEnd &&
						(wonGame ? (
							completedAllLevels ? (
								<div className="flex gap-3">
									<NormalButton onClick={resetGame}>
										Go back to level 0
									</NormalButton>
									<NormalButton onClick={endLevel}>Stay</NormalButton>
								</div>
							) : (
								<NormalButton onClick={endLevel}>Next level</NormalButton>
							)
						) : (
							<button
								onClick={endLevel}
								className="border-2 rounded border-white p-2 pl-2 pr-2 font-bold text-lg"
							>
								Try again
							</button>
						))}
				</div>
			</div>
			<div
				className={[
					"w-1/2 basis-1/5 transition-transform duration-1000 pointer-events-children",
					show ? "delay-300 translate-y-0" : "translate-y-[110%]",
				].join(" ")}
			>
				<Console roundedDir="all" headingPos="left" />
			</div>
		</div>
	);
};
export default FightUI;
