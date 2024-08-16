import { maxBotHp } from "../constants";

export interface BotStats {
	health: number;
	strength: number;
	dizzy: number;
}

export function getResetBotStats(): BotStats {
	return {
		health: maxBotHp,
		strength: 1,
		dizzy: 0,
	};
}
