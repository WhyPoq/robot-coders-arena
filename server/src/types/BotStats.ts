class BotStats {
	public health: number = 0;
	public strength: number = 0;
	public dizzy: number = 0;

	constructor() {
		this.reset();
	}

	public reset() {
		this.health = 30;
		this.strength = 1;
		this.dizzy = 0;
	}
}

export default BotStats;
