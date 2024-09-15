import { createContext, ReactNode, useContext, useState } from "react";

interface IUserContext {
	username: undefined | null | string;
	setUsername: (newUsername: null | string) => void;
}

const UserContext = createContext<IUserContext>({} as IUserContext);

export function useUserContext() {
	return useContext(UserContext);
}

interface UserContextProviderProps {
	children: ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
	const [username, setUsername] = useState<undefined | null | string>(undefined);

	return (
		<UserContext.Provider value={{ username, setUsername }}>{children}</UserContext.Provider>
	);
}
