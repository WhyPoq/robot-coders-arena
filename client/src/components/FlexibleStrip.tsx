import React, { useState, useEffect } from "react";
import { ReactNode } from "react";
import { clamp } from "../utils/MathUtils";
import { FlexibleItemContextProvider } from "../contexts/FlexibleItemContext";
import { useFlexibleItemContext } from "../contexts/FlexibleItemContext";

interface FlexibleStripProps {
	children: ReactNode;
	className?: string | undefined;
	sizeRatios?: number[];
	elemsMinSizes: number[];
	gapSize?: number;
	vertical?: boolean;
	onResizeCallback?: (poriton: number) => any;
	hideHandles?: boolean;
}

const FlexibleStrip = ({
	children,
	className = "",
	sizeRatios = [],
	elemsMinSizes,
	gapSize = 16,
	vertical = true,
	onResizeCallback,
	hideHandles = false,
}: FlexibleStripProps) => {
	const [childrenArray, setChildrenArray] = useState<ReactNode[]>([]);
	const [resizedRatios, setResizedRatios] = useState<number[]>([]);
	const [elemsRefs, setElemsRefs] = useState<React.RefObject<HTMLDivElement>[]>([]);

	const flexibleItemContext = useFlexibleItemContext();
	useEffect(() => {
		if (flexibleItemContext && onResizeCallback) onResizeCallback(flexibleItemContext.portion);
	}, [flexibleItemContext]);

	useEffect(() => {
		let childrenArrayRaw = React.Children.toArray(children);
		setChildrenArray(childrenArrayRaw);
		setElemsRefs(childrenArrayRaw.map(() => React.createRef<HTMLDivElement>()));
	}, [children]);

	useEffect(() => {
		setResizedRatios((prev) => {
			let properSizeRatios = prev;
			if (prev.length === 0) properSizeRatios = [...sizeRatios];

			// add 1's to not defined sizes (default ratio of 1)
			while (properSizeRatios.length < childrenArray.length) {
				properSizeRatios.push(1);
			}
			// remove redundant sizes
			while (properSizeRatios.length > childrenArray.length) {
				properSizeRatios.pop();
			}
			// sanitize the values: cannot be less than 0
			properSizeRatios = properSizeRatios.map((size) => Math.max(0, size));

			return properSizeRatios;
		});
	}, [childrenArray]);

	const [activeSeparator, setActiveSeparator] = useState<number | null>(null);

	useEffect(() => {
		function resetActiveSearator() {
			setActiveSeparator(null);
		}
		document.addEventListener("mouseup", resetActiveSearator);

		return () => document.removeEventListener("mouseup", resetActiveSearator);
	}, []);

	useEffect(() => {
		function resizeHandler(e: MouseEvent) {
			if (activeSeparator === null) return;
			if (activeSeparator + 1 >= resizedRatios.length) return;
			const beforeContainer = elemsRefs[activeSeparator].current;
			const afterContainer = elemsRefs[activeSeparator + 1].current;
			if (beforeContainer === null) return;
			if (afterContainer === null) return;

			const beforeContainerRect = beforeContainer.getBoundingClientRect();
			const afterContainerRect = afterContainer.getBoundingClientRect();

			const beforePos = vertical ? beforeContainerRect.top : beforeContainerRect.left;
			const afterPos = vertical ? afterContainerRect.bottom : afterContainerRect.right;

			let mousePos = vertical ? e.clientY : e.clientX;
			mousePos = clamp(
				beforePos + elemsMinSizes[activeSeparator],
				mousePos + gapSize / 2,
				afterPos - elemsMinSizes[activeSeparator + 1]
			);
			const mousePortion = (mousePos - beforePos) / (afterPos - beforePos);

			const proportionSum =
				resizedRatios[activeSeparator] + resizedRatios[activeSeparator + 1];

			const beforeTargetProportion = mousePortion * proportionSum;
			const afterTargetProportion = proportionSum - beforeTargetProportion;

			setResizedRatios((prevRatios) => {
				const newRatios = [...prevRatios];
				newRatios[activeSeparator] = beforeTargetProportion;
				newRatios[activeSeparator + 1] = afterTargetProportion;
				return newRatios;
			});
		}
		document.addEventListener("mousemove", resizeHandler);

		return () => document.removeEventListener("mousemove", resizeHandler);
	}, [activeSeparator, resizedRatios]);

	const resizedRatiosSum = resizedRatios.reduce((prev, cur) => prev + cur, 0);

	return (
		<div
			className={["h-full flex", vertical ? "flex-col" : "", className].join(" ")}
			style={{ gap: gapSize }}
		>
			{childrenArray.map((element, ind) => (
				<div
					key={ind}
					ref={elemsRefs[ind]}
					className={["basis-0 flex", vertical ? "flex-col" : ""].join(" ")}
					style={{
						flexGrow: resizedRatios[ind] ?? 1,
						zIndex: ind + 1,
					}}
				>
					{/* Actual element */}
					<FlexibleItemContextProvider portion={resizedRatios[ind] / resizedRatiosSum}>
						<div className="flex-grow">{element}</div>
					</FlexibleItemContextProvider>

					{/* Separator */}
					{ind !== childrenArray.length - 1 && (
						<div className="relative basis-0">
							<div
								className={[
									"absolute pointer-events-auto",
									vertical
										? "-top-1 -bottom-1 cursor-ns-resize"
										: "top-0 bottom-0 cursor-ew-resize",
									hideHandles ? "hidden" : "",
								].join(" ")}
								style={{
									left: vertical ? "0" : "-4px",
									right: vertical ? "0" : `-${gapSize + 4}px`,
								}}
								onMouseDown={(e) => {
									e.preventDefault();
									setActiveSeparator(ind);
								}}
							></div>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default FlexibleStrip;
