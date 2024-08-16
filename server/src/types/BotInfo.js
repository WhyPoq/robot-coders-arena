"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BotInfo {
    constructor(stats, enemyStats) {
        this.enemyPrevMove = -1;
        this.stats = stats;
        this.enemyStats = enemyStats;
        this.shortMemory = new Array(10).fill(0);
        this.longMemory = new Array(10).fill(0);
    }
}
exports.default = BotInfo;
//# sourceMappingURL=BotInfo.js.map