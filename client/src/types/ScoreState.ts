import { RoundWinner } from "./RoundWinner";

class ScoreState {
	public roundWinners: RoundWinner[];

	constructor() {
		this.roundWinners = [];
	}

	public addRound(winner: RoundWinner) {
		this.roundWinners.push(winner);
	}

	public reset() {
		this.roundWinners = [];
	}
}

export default ScoreState;
