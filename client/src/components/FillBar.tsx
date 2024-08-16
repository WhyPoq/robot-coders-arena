interface FillBarProps {
	current: number;
	maximum: number;
}

const FillBar = ({ current, maximum }: FillBarProps) => {
	let barCurrent = current;
	if (barCurrent < 0) barCurrent = 0;
	return (
		<div className="h-full border-white border-2">
			<div
				className="bg-green-600 h-full"
				style={{
					width: `${(barCurrent / maximum) * 100}%`,
				}}
			>
				<p className="text-white font-semibold h-full pl-1">
					{current}/{maximum}
				</p>
			</div>
		</div>
	);
};

export default FillBar;
