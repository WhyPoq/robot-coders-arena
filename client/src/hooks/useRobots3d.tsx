import { RobotAction } from "../types/RobotAction";
import { useSceneContext } from "../contexts/SceneContext";
import { RobotAnimationType } from "../types/RobotAnimationType";
import { useEffect, useCallback } from "react";
import { useBotStatsContext } from "../contexts/BotStatsContext";
import { BotStats } from "../types/BotStats";
import { normalPaceInterval } from "../constants";
import { usePaceContext } from "../contexts/PaceContext";
const useRobots3d = (
	robot1Action: RobotAction,
	robot2Action: RobotAction,
	triggerActivated: boolean,
	setTriggerActivated: (newVal: boolean) => void
) => {
	const {
		setRobot1Animation,
		setRobot2Animation,
		setRobot1DefaultAnimation,
		setRobot2DefaultAnimation,
	} = useSceneContext();
	const { playerStats, enemyStats } = useBotStatsContext();
	const { actionInterval } = usePaceContext();

	const setAnimationsForRobot = useCallback(
		(
			setRobotAnimation: React.Dispatch<React.SetStateAction<RobotAnimationType>>,
			_setRobotDefaultAnimation: React.Dispatch<React.SetStateAction<RobotAnimationType>>,
			action: RobotAction,
			otherAction: RobotAction,
			stats: BotStats | null,
			_otherStats: BotStats | null
		) => {
			const timeScale = actionInterval / normalPaceInterval;
			const isDizzy = stats && stats.dizzy > 0;
			// bad idea, does not work
			// if (isDizzy) {
			// 	setRobotDefaultAnimation(RobotAnimationType.Dizzy);
			// } else {
			// 	setRobotDefaultAnimation(RobotAnimationType.Idle);
			// }

			if (action === RobotAction.Die) {
				setRobotAnimation(RobotAnimationType.Die);
			}

			if (action === RobotAction.Idle) {
				if (!isDizzy) {
					setRobotAnimation(RobotAnimationType.Idle);
					if (otherAction === RobotAction.Attack) {
						setTimeout(
							() => setRobotAnimation(RobotAnimationType.Impact),
							1200 * timeScale
						);
					}
				} else {
					setRobotAnimation(RobotAnimationType.Dizzy);
				}
			} else if (action === RobotAction.Attack) {
				if (otherAction === RobotAction.Idle || otherAction === RobotAction.Upgrade) {
					setTimeout(
						() => setRobotAnimation(RobotAnimationType.AttackIdleUpgrade),
						800 * timeScale
					);
				} else if (otherAction === RobotAction.Attack) {
					setRobotAnimation(RobotAnimationType.AttackAttack);
				} else if (otherAction === RobotAction.Block) {
					setTimeout(
						() => setRobotAnimation(RobotAnimationType.AttackBlock),
						200 * timeScale
					);
				}
			} else if (action === RobotAction.Block) {
				setRobotAnimation(RobotAnimationType.Block);
			} else if (action === RobotAction.Upgrade) {
				setRobotAnimation(RobotAnimationType.Upgrade);
				if (otherAction === RobotAction.Attack) {
					setTimeout(
						() => setRobotAnimation(RobotAnimationType.Impact),
						1200 * timeScale
					);
					actionInterval;
				}
			}
		},
		[actionInterval]
	);

	useEffect(() => {
		if (triggerActivated === false) return;
		setAnimationsForRobot(
			setRobot1Animation,
			setRobot1DefaultAnimation,
			robot1Action,
			robot2Action,
			playerStats,
			enemyStats
		);
		setAnimationsForRobot(
			setRobot2Animation,
			setRobot2DefaultAnimation,
			robot2Action,
			robot1Action,
			enemyStats,
			playerStats
		);

		setTriggerActivated(false);
	}, [
		robot1Action,
		robot2Action,
		setRobot1Animation,
		setRobot2Animation,
		triggerActivated,
		setTriggerActivated,
		playerStats,
		playerStats,
	]);
};

export default useRobots3d;
