import { useGameScoreContext } from "../../../contexts/GameScore";
import CounterDot from "./CounterDot";
import { ShapePossibility } from "../../../types/ShapePossibility";

interface BotInfoProps {
	show: boolean;
}

const RoundCounter = ({ show }: BotInfoProps) => {
	const { scoreState } = useGameScoreContext();

	const shapes: ShapePossibility[] = [];
	for (let i = 0; i < 3; i++) {
		if (i >= scoreState.roundWinners.length) {
			shapes.push("none");
		} else {
			switch (scoreState.roundWinners[i]) {
				case "player":
					shapes.push("square");
					break;
				case "enemy":
					shapes.push("triangle");
					break;
				case "tie":
					shapes.push("circle");
					break;
			}
		}
	}

	return (
		<div
			className={[
				"flex gap-5 mt-4 transition-opacity duration-1000",
				show ? "opacity-100" : "opacity-0",
			].join(" ")}
		>
			{shapes.map((shape, ind) => (
				<CounterDot key={ind} innerShape={shape} />
			))}
		</div>
	);
};

export default RoundCounter;
