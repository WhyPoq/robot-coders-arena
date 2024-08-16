"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RobotAction_1 = require("../types/RobotAction");
function updateBot(botMove, enemyMove, playerStats, enemyStats) {
    if (playerStats.dizzy > 0) {
        botMove = RobotAction_1.RobotAction.Idle;
        playerStats.dizzy--;
    }
    if (enemyStats.dizzy > 0)
        enemyMove = RobotAction_1.RobotAction.Idle;
    if (botMove === RobotAction_1.RobotAction.Attack) {
        if (enemyMove === RobotAction_1.RobotAction.Attack) {
            playerStats.health -= enemyStats.attack;
        }
        else if (enemyMove === RobotAction_1.RobotAction.Block) {
            playerStats.health -= 1;
            playerStats.dizzy = 2;
        }
    }
    else if (botMove === RobotAction_1.RobotAction.Block) {
        if (enemyMove === RobotAction_1.RobotAction.Attack) {
            playerStats.health -= Math.floor(enemyStats.attack / 3);
        }
    }
    else if (botMove === RobotAction_1.RobotAction.Upgrade) {
        if (enemyMove === RobotAction_1.RobotAction.Attack) {
            playerStats.health -= enemyStats.attack * 2;
        }
        else {
            playerStats.attack += 1;
        }
    }
    else if (botMove === RobotAction_1.RobotAction.Idle) {
        if (enemyMove === RobotAction_1.RobotAction.Attack) {
            playerStats.health -= enemyStats.attack * 2;
        }
    }
    return botMove;
}
exports.default = updateBot;
//# sourceMappingURL=updateBot.js.map