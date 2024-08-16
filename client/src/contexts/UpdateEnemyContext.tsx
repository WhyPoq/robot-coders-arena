import { createContext, ReactNode, useCallback, useContext, useState } from "react";

interface IUpdateEnemyContext {
	updateDependency: boolean;
	triggerUpdate: () => void;
}

const UpdateEnemyContext = createContext<IUpdateEnemyContext>(null!);

export function useUpdateEnemyContext() {
	return useContext(UpdateEnemyContext);
}

interface UpdateEnemyContextProps {
	children: ReactNode;
}

export function UpdateEnemyContextProvider({ children }: UpdateEnemyContextProps) {
	const [updateDependency, setUpdateDependency] = useState(false);
	const triggerUpdate = useCallback(() => {
		setUpdateDependency((prev) => !prev);
	}, [setUpdateDependency]);

	return (
		<UpdateEnemyContext.Provider value={{ updateDependency, triggerUpdate }}>
			{children}
		</UpdateEnemyContext.Provider>
	);
}
