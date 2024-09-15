import * as THREE from "three";
import { CameraControls, Grid, Environment } from "@react-three/drei";
import RobotModel from "./RobotModel";
import { useSceneContext } from "../../contexts/SceneContext";
import { useEffect, useRef } from "react";

const RobotsScene = () => {
	const {
		robot1Animation,
		robot2Animation,
		setRobot1Animation,
		setRobot2Animation,
		robot1Action,
		robot2Action,
		robot1DefaultAnimation,
		robot2DefaultAnimation,
	} = useSceneContext();

	// specifying without '/robots/animations/' common prefix - adding it later
	let animationPaths = [
		["idle1.fbx"],
		["impact.fbx"],
		["attackIdleUpgrade1.fbx", "attackIdleUpgrade2.fbx"],
		["attackAttack1.fbx"],
		["attackBlock.fbx"],
		["block1.fbx", "block2.fbx"],
		["upgrade1.fbx", "upgrade2.fbx", "upgrade3.fbx"],
		["dizzy.fbx"],
		["dizzy.fbx"], // die has the same animation as dizzy
	];

	// adding common prefix '/robots/animations/'
	animationPaths = animationPaths.map((variants) =>
		variants.map((path) => "/robots/animations/" + path)
	);

	const cameraControlsRef = useRef<CameraControls>(null!);

	useEffect(() => {
		cameraControlsRef.current.mouseButtons.right = 0; // disable panning with right mouse button
		cameraControlsRef.current.setTarget(0, 0.5, 0);
	}, []);

	return (
		<>
			<color attach="background" args={["#151515"]} />

			{/* Camera */}
			<CameraControls ref={cameraControlsRef} maxDistance={6} minDistance={1} />

			{/* Lighting */}
			<pointLight position={[0, 0, 0]} intensity={1} color="#d0ffff" />
			<directionalLight position={[3, 4, 3]} castShadow />
			<Environment preset="city" environmentIntensity={0.8} />

			{/* Grid */}
			<Grid
				infiniteGrid={true}
				sectionColor="cyan"
				fadeDistance={5}
				fadeFrom={0}
				fadeStrength={5}
				sectionThickness={1}
				sectionSize={0.3}
				side={THREE.DoubleSide}
				position={[0, -0.1, 0]}
			/>

			<mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
				<planeGeometry args={[6, 6]} />
				<shadowMaterial />
			</mesh>

			{/* Objects */}
			<group position={[-0.6, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
				<RobotModel
					modelPath="/robots/Robot1.fbx"
					activeAnim={robot1Animation}
					defaultAnimation={robot1DefaultAnimation}
					setActiveAnim={setRobot1Animation}
					animationPaths={animationPaths}
					doingAction={robot1Action}
					name="You"
				/>
			</group>
			<group position={[0.6, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
				<RobotModel
					modelPath="/robots/Robot3.fbx"
					activeAnim={robot2Animation}
					defaultAnimation={robot2DefaultAnimation}
					setActiveAnim={setRobot2Animation}
					animationPaths={animationPaths}
					doingAction={robot2Action}
					name="Enemy"
				/>
			</group>
		</>
	);
};

export default RobotsScene;
