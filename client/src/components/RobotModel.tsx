import { useEffect, useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useFBX, Text } from "@react-three/drei";
import { AnimationMixer } from "three";
import { FBXLoader } from "three-stdlib";
import * as THREE from "three";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import { RobotAction } from "../types/RobotAction";
import { RobotAnimationType } from "../types/RobotAnimationType";
import { usePaceContext } from "../contexts/PaceContext";
import { normalPaceInterval } from "../constants";

interface ModelWithAnimationsProps {
	animationPaths?: string[][];
	activeAnim?: number;
	defaultAnimation?: number;
	setActiveAnim: (newValue: number) => void;
	modelPath: string;
	doingAction: RobotAction;
	name: string;
}

const RobotModel = ({
	animationPaths = [],
	activeAnim = 0,
	defaultAnimation = 1,
	setActiveAnim,
	modelPath,
	doingAction,
	name,
}: ModelWithAnimationsProps) => {
	const loadedFbx = useFBX(modelPath);
	const fbx = useMemo(() => SkeletonUtils.clone(loadedFbx), [loadedFbx]);
	const objRef = useRef<THREE.Group>(null!);
	const textRef = useRef<Text>(null!);
	const textGroupRef = useRef<THREE.Group>(null!);

	const [actionText, setActionText] = useState<string | undefined>(undefined);
	const [prevActionText, setPrevActionText] = useState<string | undefined>(undefined);

	const { actionInterval } = usePaceContext();
	const speedUpCoeff = normalPaceInterval / actionInterval;

	activeAnim = activeAnim - 1;
	defaultAnimation = defaultAnimation - 1;

	useEffect(() => {
		if (actionText !== undefined) setPrevActionText(actionText);
	}, [actionText]);

	useEffect(() => {
		if (activeAnim === 0) {
			setActionText(undefined);
			return;
		}

		if (activeAnim === RobotAnimationType.Dizzy - 1) {
			setActionText("Stunned");
			return;
		}

		if (activeAnim === RobotAnimationType.Die - 1) {
			setActionText("Defeated!");
			return;
		}

		switch (doingAction) {
			case RobotAction.Attack:
				setActionText("Attack");
				break;
			case RobotAction.Block:
				setActionText("Block");
				break;
			case RobotAction.Upgrade:
				setActionText("Upgrade");
				break;
			default:
				setActionText(undefined);
		}
	}, [doingAction, setActionText, activeAnim]);

	useEffect(() => {
		const bodyMaterial = new THREE.MeshStandardMaterial({
			map: new THREE.TextureLoader().load("/robots/GradientC.png"),
			metalness: 0.9, // 0.7
			roughness: 0.3, // 0.5
		});
		fbx.traverse((child) => {
			if (child instanceof THREE.Mesh && child.isMesh) {
				child.material = bodyMaterial;
				child.castShadow = true;
			}
		});
	}, [fbx]);

	const [loadedAnimations, setLoadedAnimations] = useState<THREE.AnimationClip[][]>([]);
	const [animationActions, setAnimationActions] = useState<THREE.AnimationAction[][]>([]);

	const [lastActiveAnim, setLastActiveAnim] = useState<THREE.AnimationAction | undefined>(
		undefined
	);
	const [mixer, setMixer] = useState<AnimationMixer | null>(null);
	useEffect(() => {
		setMixer(new AnimationMixer(fbx));
	}, [fbx]);

	useEffect(() => {
		const loader = new FBXLoader();
		const loadingAnimations = new Array(animationPaths.length)
			.fill(undefined)
			.map((_, index) =>
				new Array<THREE.AnimationClip | undefined>(animationPaths[index].length).fill(
					undefined
				)
			);

		let animationsCount = 0;
		animationPaths.forEach((animPathVariants) => (animationsCount += animPathVariants.length));
		let loadedCount = 0;

		animationPaths.forEach((animPathVariants, index) => {
			animPathVariants.forEach((animPath, variantIndex) => {
				loader.load(animPath, (anim) => {
					loadingAnimations[index][variantIndex] = anim.animations[0];
					loadedCount++;
					if (loadedCount === animationsCount) {
						setLoadedAnimations(loadingAnimations as THREE.AnimationClip[][]);
					}
				});
			});
		});
	}, []);

	useEffect(() => {
		if (
			activeAnim < 0 ||
			activeAnim >= animationActions.length ||
			animationActions[activeAnim] === undefined
		)
			return;

		if (lastActiveAnim !== undefined) {
			lastActiveAnim.fadeOut(0.4);
		}
		const curAnim =
			animationActions[activeAnim][
				Math.floor(Math.random() * animationActions[activeAnim].length)
			];

		curAnim.reset().fadeIn(0.2).play();
		setLastActiveAnim(curAnim);

		const clipDur = curAnim.getClip().duration * 1000;
		const fadeoutDur = Math.min(200, clipDur * 0.9);
		if (activeAnim !== RobotAnimationType.Idle - 1 && clipDur - fadeoutDur < 2100) {
			setTimeout(() => {
				setActiveAnim(defaultAnimation + 1);
			}, clipDur - fadeoutDur);
		}
	}, [activeAnim, animationActions, setLastActiveAnim, defaultAnimation]);

	useEffect(() => {
		if (mixer && loadedAnimations.length > 0) {
			const actions = loadedAnimations.map((clips) =>
				clips.map((clip) => mixer.clipAction(clip).reset())
			);
			setAnimationActions(actions);
		}
	}, [loadedAnimations, mixer]);

	useFrame((state, deltaTime) => {
		if (mixer) {
			mixer.update(deltaTime * speedUpCoeff);
		}

		let cameraWorldPos: THREE.Vector3 = new THREE.Vector3();
		state.camera.getWorldPosition(cameraWorldPos);
		let textWorldPos: THREE.Vector3 = new THREE.Vector3();
		textGroupRef.current.getWorldPosition(textWorldPos);

		const lookDir = cameraWorldPos.sub(new THREE.Vector3(0, 0.5, 0)).normalize();
		const lookPos = lookDir.clone().add(textWorldPos);
		textGroupRef.current.lookAt(lookPos);

		const textMatrial = (textRef.current as any).material;
		if (actionText !== undefined)
			textMatrial.opacity = Math.min(1, textMatrial.opacity + 5 * deltaTime);
		else {
			textMatrial.opacity = Math.max(0, textMatrial.opacity - 5 * deltaTime);
		}
	});

	return (
		<group scale={0.3} ref={objRef}>
			<group ref={textGroupRef}>
				<Text
					ref={textRef}
					position={[0, 6, 0]}
					anchorX={"center"}
					anchorY={"middle"}
					fontSize={0.7}
				>
					{prevActionText}
					<meshStandardMaterial color="cyan" side={THREE.DoubleSide} />
				</Text>
				<Text position={[0, 4.5, 0]} anchorX={"center"} anchorY={"middle"} fontSize={0.5}>
					{name}
					<meshStandardMaterial color="white" side={THREE.DoubleSide} />
				</Text>
			</group>
			<primitive object={fbx}></primitive>
		</group>
	);
};

export default RobotModel;
