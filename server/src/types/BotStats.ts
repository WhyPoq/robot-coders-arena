class BotStats {
	public health: number = 0;
	public attack: number = 0;
	public dizzy: number = 0;

	constructor() {
		this.reset();
	}

	public reset() {
		this.health = 30;
		this.attack = 1;
		this.dizzy = 0;
	}
}

export default BotStats;
