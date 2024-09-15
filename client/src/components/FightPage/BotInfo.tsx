import heartIcon from "../../assets/heart_icon.svg";
import swordsIcon from "../../assets/swords_icon.svg";
import squareIcon from "../../assets/square.svg";
import triangleIcon from "../../assets/triangle.svg";

import { BotStats, getResetBotStats } from "../../types/BotStats";
import FillBar from "./FillBar";
import { maxBotHp } from "../../constants";

interface BotInfoProps {
	side: "left" | "right";
	show: boolean;
	botStats: BotStats | null;
	name: string;
	shape: "square" | "triangle";
}

const BotInfo = ({ side, show, botStats, name, shape }: BotInfoProps) => {
	if (botStats === null) {
		botStats = getResetBotStats();
	}

	return (
		<div
			className={[
				"h-full pl-10 pr-10 flex flex-col transition-transform duration-1000",
				side === "right" ? "items-end" : "",
				show
					? "translate-x-0"
					: side === "left"
					? "-translate-x-[110%]"
					: "translate-x-[110%]",
			].join(" ")}
		>
			<div
				className={[
					"flex mb-5 pointer-events-auto gap-4 items-baseline",
					side === "right" ? "flex-row-reverse" : "",
				].join(" ")}
			>
				<p className="text-2xl font-bold">{name}</p>
				<div className="size-4">
					{shape === "square" ? (
						<img className="h-full" src={squareIcon} />
					) : (
						<img className="h-full" src={triangleIcon} />
					)}
				</div>
			</div>
			<div className="flex items-center gap-3 mb-2">
				<div style={{ order: side === "left" ? 0 : 1 }}>
					<img className="h-full" src={heartIcon} alt="Health" />
				</div>
				<div className="w-32 p-1 pointer-events-auto">
					<FillBar current={botStats.health} maximum={maxBotHp} />
				</div>
			</div>
			<div className="flex items-center gap-3 font-semibold text-xl pointer-events-auto">
				<div style={{ order: side === "left" ? 0 : 1 }}>
					<img className="h-full" src={swordsIcon} alt="Strength" />
				</div>
				<div>{botStats.strength}</div>
			</div>
		</div>
	);
};

export default BotInfo;
