import { createContext, ReactNode, useContext, useState } from "react";

interface ICurLevelContext {
	curLevel: number;
	setCurLevel: React.Dispatch<React.SetStateAction<number>>;
}

const CurLevelContext = createContext<ICurLevelContext>(null!);

export function useCurLevelContext() {
	return useContext(CurLevelContext);
}

interface CurLevelContextProviderProps {
	children: ReactNode;
}

export function CurLevelContextProvider({ children }: CurLevelContextProviderProps) {
	const [curLevel, setCurLevel] = useState(0);
	return (
		<CurLevelContext.Provider value={{ curLevel, setCurLevel }}>
			{children}
		</CurLevelContext.Provider>
	);
}
