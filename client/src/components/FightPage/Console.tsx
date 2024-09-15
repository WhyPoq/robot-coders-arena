import Panel from "./Panel";
import { useConsoleContext } from "../../contexts/ConsoleContext";
import { useEffect, useRef } from "react";

interface ConsoleProps {
	roundedDir: "left" | "right" | "all";
	headingPos: "left" | "right";
	className: string;
}

const Console = ({ roundedDir, headingPos, className }: ConsoleProps) => {
	let { lines } = useConsoleContext();
	const divRef = useRef<HTMLDivElement>(null);

	if (lines.length === 0) {
		lines = [{ type: "log", value: "" }];
	}

	useEffect(() => {
		if (divRef.current !== null) {
			divRef.current.scrollTo(0, divRef.current.scrollHeight);
		}
	}, [lines]);

	return (
		<Panel
			tabsHeadings="Console"
			roundedDir={roundedDir}
			headingPos={headingPos}
			className={className}
		>
			<div className="h-full p-2 pl-7 pr-0">
				<div className="h-full relative">
					<div
						className="top-0 left-0 bottom-0 right-0 pr-2 overflow-y-auto absolute leading-tight custom-scrollbar"
						ref={divRef}
					>
						{lines.map((line, ind) => (
							<pre
								key={ind}
								className={[
									"whitespace-pre-wrap font-roboto-mono",
									line.type === "error" ? "text-red-400" : "",
								].join(" ")}
							>
								{"> " + line.value}
							</pre>
						))}
					</div>
				</div>
			</div>
		</Panel>
	);
};

export default Console;
