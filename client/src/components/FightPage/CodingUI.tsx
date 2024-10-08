import CodeEditor from "./CodeEditor";
import Console from "./Console";
import Guide from "./Guide";
import EnemyCode from "./EnemyCode";
import FlexibleStrip from "./FlexibleStrip";
import Panel from "./Panel";
import Info from "./Info";

interface CodingUIProps {
	show: boolean;
	code: string;
	setCode: (newVal: string) => void;
}

const CodingUI = ({ show, setCode, code }: CodingUIProps) => {
	return (
		<FlexibleStrip
			elemsMinSizes={[250, 100, 200]}
			vertical={false}
			className={["w-full"].join(" ")}
			hideHandles={!show}
			sizeRatios={[4, 1, 3]}
		>
			<FlexibleStrip
				sizeRatios={[7, 2]}
				elemsMinSizes={[40, 40]}
				className={[
					show ? "translate-x-0" : "-translate-x-[110%]",
					"transition-transform duration-1000",
				].join(" ")}
			>
				<Panel
					tabsHeadings={["Your Bot Code", "Info"]}
					roundedDir="right"
					headingPos="left"
					className="pointer-events-auto pointer-events-children"
				>
					<CodeEditor code={code} setCode={setCode} />
					<Info />
				</Panel>
				<Console
					roundedDir="right"
					headingPos="left"
					className="pointer-events-auto pointer-events-children"
				/>
			</FlexibleStrip>

			<div className="h-full"></div>

			<FlexibleStrip
				sizeRatios={[1, 1]}
				elemsMinSizes={[40, 40]}
				className={[
					show ? "translate-x-0" : "translate-x-full",
					"transition-all duration-1000",
				].join(" ")}
			>
				<Guide
					roundedDir="left"
					headingPos="right"
					className="pointer-events-auto pointer-events-children"
				/>
				<EnemyCode
					roundedDir="left"
					headingPos="right"
					className="pointer-events-auto pointer-events-children"
				/>
			</FlexibleStrip>
		</FlexibleStrip>
	);
};

export default CodingUI;
