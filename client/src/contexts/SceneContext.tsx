import { createContext, ReactNode, useContext, useState } from "react";
import { RobotAnimationType } from "../types/RobotAnimationType";
import { RobotAction } from "../types/RobotAction";

interface ISceneContext {
	robot1Animation: RobotAnimationType;
	setRobot1Animation: React.Dispatch<React.SetStateAction<RobotAnimationType>>;
	robot2Animation: RobotAnimationType;
	setRobot2Animation: React.Dispatch<React.SetStateAction<RobotAnimationType>>;

	robot1DefaultAnimation: RobotAnimationType;
	setRobot1DefaultAnimation: React.Dispatch<React.SetStateAction<RobotAnimationType>>;
	robot2DefaultAnimation: RobotAnimationType;
	setRobot2DefaultAnimation: React.Dispatch<React.SetStateAction<RobotAnimationType>>;

	robot1Action: RobotAction;
	setRobot1Action: React.Dispatch<React.SetStateAction<RobotAction>>;
	robot2Action: RobotAction;
	setRobot2Action: React.Dispatch<React.SetStateAction<RobotAction>>;
}

const SceneContext = createContext<ISceneContext>(null!);

export function useSceneContext() {
	return useContext(SceneContext);
}

interface SceneContextProviderProps {
	children: ReactNode;
}

export function SceneContextProvider({ children }: SceneContextProviderProps) {
	const [robot1Animation, setRobot1Animation] = useState(RobotAnimationType.None);
	const [robot2Animation, setRobot2Animation] = useState(RobotAnimationType.None);

	const [robot1DefaultAnimation, setRobot1DefaultAnimation] = useState(RobotAnimationType.Idle);
	const [robot2DefaultAnimation, setRobot2DefaultAnimation] = useState(RobotAnimationType.Idle);

	const [robot1Action, setRobot1Action] = useState(RobotAction.Idle);
	const [robot2Action, setRobot2Action] = useState(RobotAction.Idle);

	return (
		<SceneContext.Provider
			value={{
				robot1Animation,
				setRobot1Animation,
				robot2Animation,
				setRobot2Animation,
				robot1DefaultAnimation,
				setRobot1DefaultAnimation,
				robot2DefaultAnimation,
				setRobot2DefaultAnimation,
				robot1Action,
				setRobot1Action,
				robot2Action,
				setRobot2Action,
			}}
		>
			{children}
		</SceneContext.Provider>
	);
}
