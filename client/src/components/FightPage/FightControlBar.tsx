import playIcon from "../../assets/play_circle_icon.svg";
import stopIcon from "../../assets/stop_circle_icon.svg";
import NormalButton from "./NormalButton";
import { socket } from "../../socket";
import { usePaceContext } from "../../contexts/PaceContext";
import { Pace } from "../../types/Pace";
import { useEffect, useRef, useState } from "react";

interface FightControlBarProps {
	isCodingPhase: boolean;
	toggleStartFight: () => void;
	isPending: boolean;
}

const FightControlBar = ({ isCodingPhase, toggleStartFight, isPending }: FightControlBarProps) => {
	const { pace, setPace } = usePaceContext();

	const [showPending, setShowPending] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (isPending) {
			if (timeoutRef.current === null) {
				timeoutRef.current = setTimeout(() => {
					setShowPending(true);
				}, 300);
			}
		} else {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
			setShowPending(false);
		}
	}, [isPending, setShowPending]);

	return (
		<div className="flex justify-center h-10 mt-2 no-pointer-events-current">
			<div className="flex items-center -translate-x-[80px] no-pointer-events-current">
				<div className="w-40 flex justify-end pointer-events-children">
					<NormalButton
						size="small"
						className={[
							"mr-7 transition-opacity duration-1000",
							isCodingPhase ? "opacity-0 pointer-events-none" : "opacity-100",
						].join(" ")}
						onClick={() => {
							let newPace: Pace = "normal";
							if (pace === "normal") {
								newPace = "fast";
							}
							socket.emit("changePace", newPace);
							setPace(newPace);
						}}
					>
						{pace === "normal" ? "Speed Up" : "Slow down"}
					</NormalButton>
				</div>
				<button
					onClick={toggleStartFight}
					className="pointer-events-auto h-full w-10 flex justify-center items-center"
				>
					{isCodingPhase ? (
						showPending ? (
							<div className="loading-spinner"></div>
						) : (
							<img src={playIcon} className="h-full" alt="Play" />
						)
					) : (
						<img src={stopIcon} className="h-full" alt="Stop" />
					)}
				</button>
			</div>
		</div>
	);
};

export default FightControlBar;
