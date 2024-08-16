import BotStats from "../types/BotStats";
import { RobotAction } from "../types/RobotAction";

function updateBot(
	botMove: RobotAction,
	enemyMove: RobotAction,
	playerStats: BotStats,
	enemyStats: BotStats
): RobotAction {
	if (playerStats.dizzy > 0) {
		botMove = RobotAction.Idle;
		playerStats.dizzy--;
	}
	if (enemyStats.dizzy > 0) enemyMove = RobotAction.Idle;

	if (botMove === RobotAction.Attack) {
		if (enemyMove === RobotAction.Attack) {
			playerStats.health -= enemyStats.attack;
		} else if (enemyMove === RobotAction.Block) {
			playerStats.health -= 1;
			playerStats.dizzy = 2;
		}
	} else if (botMove === RobotAction.Block) {
		if (enemyMove === RobotAction.Attack) {
			playerStats.health -= Math.floor(enemyStats.attack / 3);
		}
	} else if (botMove === RobotAction.Upgrade) {
		if (enemyMove === RobotAction.Attack) {
			playerStats.health -= enemyStats.attack * 2;
		} else {
			playerStats.attack += 1;
		}
	} else if (botMove === RobotAction.Idle) {
		if (enemyMove === RobotAction.Attack) {
			playerStats.health -= enemyStats.attack * 2;
		}
	}

	return botMove;
}

export default updateBot;
