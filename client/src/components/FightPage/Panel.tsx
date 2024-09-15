import { ReactNode, useEffect, useState } from "react";
import React from "react";

interface PanelProps {
	tabsHeadings: string[] | string;
	headingPos: "left" | "right";
	roundedDir: "left" | "right" | "all";
	className?: string;
	children?: ReactNode;
}

const Panel = ({ tabsHeadings, roundedDir, headingPos, className = "", children }: PanelProps) => {
	if (typeof tabsHeadings === "string") tabsHeadings = [tabsHeadings];

	const [childrenArray, setChildrenArray] = useState<ReactNode[]>([]);
	useEffect(() => {
		let childrenArrayRaw = React.Children.toArray(children);
		if (childrenArrayRaw.length === 0)
			throw new Error(
				`Panel with headings ${tabsHeadings.join(", ")} does not have any children`
			);

		if (tabsHeadings.length !== childrenArrayRaw.length) {
			throw new Error(
				`There number of heading and children does not match for panel with headings ${tabsHeadings.join(
					", "
				)}`
			);
		}
		setChildrenArray(childrenArrayRaw);
	}, [children]);

	const [activePanel, setActivePanel] = useState(0);

	let roundedStyles = "";
	if (roundedDir === "right") {
		roundedStyles = "pr-4 rounded-r-xl";
	} else if (roundedDir === "left") {
		roundedStyles = "pl-4 rounded-l-xl";
	} else if (roundedDir === "all") {
		roundedStyles = "pl-4 pr-4 rounded-l-xl rounded-r-xl";
	}

	return (
		<div
			className={[
				"h-full flex flex-col",
				headingPos === "left" ? "items-start" : "items-end",
				className,
			].join(" ")}
		>
			<div className="flex">
				{tabsHeadings.map((heading, ind) => (
					<button
						key={ind}
						className={[
							"p-1 pl-4 pr-4 rounded-t-xl font-semibold",
							headingPos === "left" ? "ml-2" : "mr-2",
							ind === activePanel ? "bg-vscode-editor-background" : "bg-[#262626]",
						].join(" ")}
						onClick={() => setActivePanel(ind)}
					>
						{heading}
					</button>
				))}
			</div>

			<div
				className={[
					"flex-grow bg-vscode-editor-background shadow-black relative w-full shadow-md",
					roundedStyles,
				].join(" ")}
			>
				{childrenArray[activePanel]}
			</div>
		</div>
	);
};

export default Panel;
