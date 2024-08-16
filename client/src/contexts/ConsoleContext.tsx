import { createContext, ReactNode, useContext, useState } from "react";
import ConsoleLine from "../types/ConsoleLine";

interface IConsoleContext {
	lines: ConsoleLine[];
	setLines: (newLines: ConsoleLine[] | ((prev: ConsoleLine[]) => ConsoleLine[])) => void;
}

const ConsoleContext = createContext<IConsoleContext>(null!);

export function useConsoleContext() {
	return useContext(ConsoleContext);
}

interface ConsoleContextProviderProps {
	children?: ReactNode;
}

export function ConsoleContextProvider({ children }: ConsoleContextProviderProps) {
	const [lines, setLines] = useState<ConsoleLine[]>([]);
	return (
		<ConsoleContext.Provider value={{ lines, setLines }}>{children}</ConsoleContext.Provider>
	);
}
