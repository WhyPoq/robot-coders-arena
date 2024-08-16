import BotStats from "./BotStats";

class BotInfo {
	public enemyPrevMove: number;
	public stats: BotStats;
	public enemyStats: BotStats;
	public shortMemory: number[];
	public longMemory: number[];

	constructor(stats: BotStats, enemyStats: BotStats) {
		this.enemyPrevMove = -1;
		this.stats = stats;
		this.enemyStats = enemyStats;
		this.shortMemory = new Array(10).fill(0);
		this.longMemory = new Array(10).fill(0);
	}
}

export default BotInfo;
