import { createContext, ReactNode, useContext } from "react";
import ScoreState from "../types/ScoreState";

interface IGameScoreContext {
	scoreState: ScoreState;
}

const GameScoreContext = createContext<IGameScoreContext>(null!);

export function useGameScoreContext() {
	return useContext(GameScoreContext);
}

interface GameScoreContextProviderProps {
	children: ReactNode;
}

export function GameScoreContextProvider({ children }: GameScoreContextProviderProps) {
	const scoreState = new ScoreState();
	return <GameScoreContext.Provider value={{ scoreState }}>{children}</GameScoreContext.Provider>;
}
