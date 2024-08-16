import { createContext, ReactNode, useContext } from "react";

interface IFlexibleItemContext {
	portion: number;
}

const FlexibleItemContext = createContext<IFlexibleItemContext>(null!);

export function useFlexibleItemContext() {
	return useContext(FlexibleItemContext);
}

interface FlexibleItemProviderProps {
	children: ReactNode;
	portion: number;
}

export function FlexibleItemContextProvider({ children, portion }: FlexibleItemProviderProps) {
	return (
		<FlexibleItemContext.Provider value={{ portion }}>{children}</FlexibleItemContext.Provider>
	);
}
