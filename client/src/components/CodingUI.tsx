import CodeEditor from "../components/CodeEditor";
import Console from "../components/Console";
import Guide from "../components/Guide";
import EnemyCode from "../components/EnemyCode";
import FlexibleStrip from "../components/FlexibleStrip";
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
			className={["w-full pointer-events-none"].join(" ")}
			hideHandles={!show}
			sizeRatios={[4, 1, 3]}
		>
			<FlexibleStrip
				sizeRatios={[7, 2]}
				elemsMinSizes={[40, 40]}
				className={[
					"pointer-events-auto",
					show ? "translate-x-0" : "-translate-x-[110%]",
					"transition-transform duration-1000",
				].join(" ")}
			>
				<Panel
					tabsHeadings={["Your Bot Code", "Info"]}
					roundedDir="right"
					headingPos="left"
				>
					<CodeEditor code={code} setCode={setCode} />
					<Info />
				</Panel>
				<Console roundedDir="right" headingPos="left" />
			</FlexibleStrip>

			<div className="h-full pointer-events-none"></div>

			<FlexibleStrip
				sizeRatios={[1, 1]}
				elemsMinSizes={[40, 40]}
				className={[
					"pointer-events-auto",
					show ? "translate-x-0" : "translate-x-full",
					"transition-all duration-1000",
				].join(" ")}
			>
				<Guide roundedDir="left" headingPos="right" />
				<EnemyCode roundedDir="left" headingPos="right" />
			</FlexibleStrip>
		</FlexibleStrip>
	);
};

export default CodingUI;
