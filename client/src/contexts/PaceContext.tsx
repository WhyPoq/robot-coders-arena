import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { fastPaceInterval, normalPaceInterval } from "../constants";
import { Pace } from "../types/Pace";

interface IPaceContext {
	actionInterval: number;
	pace: Pace;
	setPace: (newPace: Pace) => void;
}

const PaceContext = createContext<IPaceContext>(null!);

export function usePaceContext() {
	return useContext(PaceContext);
}

interface PaceContextProviderProps {
	children: ReactNode;
}

export function PaceContextProvider({ children }: PaceContextProviderProps) {
	const [actionInterval, setActionInterval] = useState(normalPaceInterval);
	const [pace, setPaceInner] = useState<Pace>("normal");

	const setPace = useCallback(
		(newPace: Pace) => {
			if (newPace === "normal") setActionInterval(normalPaceInterval);
			else setActionInterval(fastPaceInterval);
			setPaceInner(newPace);
		},
		[setActionInterval]
	);

	return (
		<PaceContext.Provider value={{ actionInterval, pace, setPace }}>
			{children}
		</PaceContext.Provider>
	);
}
