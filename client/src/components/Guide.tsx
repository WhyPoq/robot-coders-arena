import { useEnemyInfoContext } from "../contexts/EnemyInfoContext";
import Panel from "./Panel";

interface CodeEditorProps {
	roundedDir: "left" | "right";
	headingPos: "left" | "right";
}

const Guide = ({ roundedDir, headingPos }: CodeEditorProps) => {
	const { description } = useEnemyInfoContext();

	return (
		<Panel tabsHeadings="Guide" roundedDir={roundedDir} headingPos={headingPos}>
			<div className="h-full p-2 pt-5 pl-7 pr-0">
				<div className="h-full relative">
					<div
						className="guide top-0 left-0 bottom-0 right-0 pr-2 overflow-y-auto absolute leading-tight custom-scrollbar font-roboto-mono"
						dangerouslySetInnerHTML={{ __html: description }}
					></div>
				</div>
			</div>
		</Panel>
	);
};

export default Guide;
