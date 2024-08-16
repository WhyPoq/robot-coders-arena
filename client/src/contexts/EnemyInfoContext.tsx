import { createContext, ReactNode, useContext, useState } from "react";

interface IEnemyInfoContext {
	code: string;
	setCode: (newVal: string) => void;
	description: string;
	setDescription: (newVal: string) => void;
}

const EnemyInfoContext = createContext<IEnemyInfoContext>(null!);

export function useEnemyInfoContext() {
	return useContext(EnemyInfoContext);
}

interface EnemyInfoContextProps {
	children: ReactNode;
}

export function EnemyInfoContextProvider({ children }: EnemyInfoContextProps) {
	const [code, setCode] = useState("");
	const [description, setDescription] = useState("");

	return (
		<EnemyInfoContext.Provider value={{ code, setCode, description, setDescription }}>
			{children}
		</EnemyInfoContext.Provider>
	);
}
