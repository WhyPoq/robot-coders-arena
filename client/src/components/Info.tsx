import ActionResultsTable from "./ActionResultsTable";

const Info = () => {
	return (
		<div className="h-full relative">
			<div className="absolute top-4 bottom-4 left-0 right-0 overflow-auto p-5 custom-scrollbar">
				<p className="text-lg mb-5">
					Here are all the possible outcomes after you and your enemy chose an action:
				</p>
				<ActionResultsTable />
				<p className="text-lg mt-8 mb-4">If after 100 moves nobody died, it is a tie.</p>
				<p className="text-lg">
					If both bots died at the same time, whoever has the least health (even if health
					is negative) looses. If both health values are equal, it is a tie
				</p>
			</div>
		</div>
	);
};

export default Info;
