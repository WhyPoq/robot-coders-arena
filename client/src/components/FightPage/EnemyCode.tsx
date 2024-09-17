import WrappedEditor from "./WrappedEditor";
import Panel from "./Panel";
import { useEffect, useState } from "react";
import { serverUrl } from "../../constants";
import { useUpdateEnemyContext } from "../../contexts/UpdateEnemyContext";
import { useEnemyInfoContext } from "../../contexts/EnemyInfoContext";

interface CodeEditorProps {
	roundedDir: "left" | "right";
	headingPos: "left" | "right";
	className?: string;
}

const EnemyCode = ({ roundedDir, headingPos, className = "" }: CodeEditorProps) => {
	const { code, setCode, setDescription } = useEnemyInfoContext();
	const [showCode, setShowCode] = useState(true);

	const resultCode = `\
let ATTACK = 1;
let BLOCK = 2;
let UPGRADE = 3;

function move(shortMemory, enemyPrevMove, longMemory) {
${code}
}\
	`;

	const { updateDependency } = useUpdateEnemyContext();

	useEffect(() => {
		async function getCode() {
			try {
				const response = await fetch(serverUrl + "/enemyBots", { credentials: "include" });
				if (response.ok) {
					const enemyBotData = (await response.json()) as {
						code: string;
						description: string;
						showCode: boolean;
					};
					setDescription(enemyBotData.description);
					if (enemyBotData.showCode) setCode(enemyBotData.code);
					setShowCode(enemyBotData.showCode);
				} else {
					const errorMessage = await response.text();
					throw `response status is ${response.status} (not okay): ${errorMessage}`;
				}
			} catch (e) {
				console.error("Error while fetching enemy bot code:", e);
			}
		}

		getCode();
	}, [updateDependency]);

	return (
		<Panel
			tabsHeadings="Enemy Bot Code"
			roundedDir={roundedDir}
			headingPos={headingPos}
			className={className}
		>
			{showCode ? (
				<WrappedEditor
					value={resultCode}
					options={{
						readOnly: true,
						readOnlyMessage: {
							value: "You cannot edit enemy bot's code",
						},
						glyphMargin: false,
						formatOnPaste: false,
					}}
				/>
			) : (
				<div className="w-hull h-full flex items-center justify-center text-xl">Hidden</div>
			)}
		</Panel>
	);
};

export default EnemyCode;
