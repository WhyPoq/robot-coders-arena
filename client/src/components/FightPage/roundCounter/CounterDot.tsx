import squareIcon from "../../../assets/square.svg";
import triangleIcon from "../../../assets/triangle.svg";
import circleIcon from "../../../assets/circle.svg";
import { ShapePossibility } from "../../../types/ShapePossibility";

interface ConunterDotProps {
	innerShape: ShapePossibility;
}

const CounterDot = ({ innerShape }: ConunterDotProps) => {
	let icon = "";
	switch (innerShape) {
		case "circle":
			icon = circleIcon;
			break;
		case "square":
			icon = squareIcon;
			break;
		case "triangle":
			icon = triangleIcon;
			break;
	}

	return (
		<div className="size-7 rounded-full bg-transparent border-white border-2 p-[0.4rem]">
			{icon && <img className="w-full h-full" src={icon} />}
		</div>
	);
};

export default CounterDot;
