import { createContext, ReactNode, useContext, useState } from "react";
import { BotStats } from "../types/BotStats";

interface IBotStatsContext {
	playerStats: BotStats | null;
	setPlayerStats: React.Dispatch<React.SetStateAction<BotStats | null>>;
	enemyStats: BotStats | null;
	setEnemyStats: React.Dispatch<React.SetStateAction<BotStats | null>>;
}

const BotStatsContext = createContext<IBotStatsContext>(null!);

export function useBotStatsContext() {
	return useContext(BotStatsContext);
}

interface BotStatsContextProviderProps {
	children?: ReactNode;
}

export function BotStatsContextProvider({ children }: BotStatsContextProviderProps) {
	const [playerStats, setPlayerStats] = useState<BotStats | null>(null);
	const [enemyStats, setEnemyStats] = useState<BotStats | null>(null);

	return (
		<BotStatsContext.Provider
			value={{ playerStats, setPlayerStats, enemyStats, setEnemyStats }}
		>
			{children}
		</BotStatsContext.Provider>
	);
}
