import WrappedEditor from "./WrappedEditor";
import Panel from "./Panel";
import { useEffect } from "react";
import { serverUrl } from "../constants";
import { useUpdateEnemyContext } from "../contexts/UpdateEnemyContext";
import { useEnemyInfoContext } from "../contexts/EnemyInfoContext";

interface CodeEditorProps {
	roundedDir: "left" | "right";
	headingPos: "left" | "right";
}

const EnemyCode = ({ roundedDir, headingPos }: CodeEditorProps) => {
	const { code, setCode, setDescription } = useEnemyInfoContext();

	const resultCode = `\
const ATTACK = 1;
const BLOCK = 2;
const UPGRADE = 3;

function move(shortMemory, enemyPrevMove, stats, enemyStats, longMemory) {
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
					};
					setCode(enemyBotData.code);
					setDescription(enemyBotData.description);
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
		<Panel tabsHeadings="Enemy Bot Code" roundedDir={roundedDir} headingPos={headingPos}>
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
		</Panel>
	);
};

export default EnemyCode;
