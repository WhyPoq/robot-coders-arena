import { maxBotHp } from "../constants";

export interface BotStats {
	health: number;
	attack: number;
	dizzy: number;
}

export function getResetBotStats(): BotStats {
	return {
		health: maxBotHp,
		attack: 1,
		dizzy: 0,
	};
}
