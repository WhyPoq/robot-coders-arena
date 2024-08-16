const ActionResultsTable = () => {
	return (
		<table cellSpacing={0}>
			<tbody>
				<tr>
					<th></th>
					<th></th>
					<th colSpan={3} className="border-b text-center p-2 pt-1 pb-1 text-xl">
						Your action
					</th>
				</tr>

				<tr>
					<th></th>
					<th className="border-b"></th>
					<th className="border-b border-l p-2 pt-1 pb-1">Attack</th>
					<th className="border-b border-l p-2 pt-1 pb-1">Block</th>
					<th className="border-b border-l border-r p-2 pt-1 pb-1">Upgrade</th>
				</tr>

				<tr>
					<th rowSpan={3} className="text-center p-2 pt-1 pb-1 text-xl">
						<span className="sideways">Enemy action</span>
					</th>
					<th className="border-b border-l p-2">
						<span className="sideways">Attack</span>
					</th>
					<td className="border-b border-l p-2">
						<p>
							<span className="text-blue-500">You get:</span>{" "}
							<span className="text-vscode-cyan italic">enemy_attack</span> damage
						</p>
						<p>
							<span className="text-red-500">Enemy get:</span>{" "}
							<span className="text-vscode-cyan italic">your_attack</span> damage
						</p>
					</td>
					<td className="border-b border-l p-2">
						<p>
							<span className="text-blue-500">You get:</span> (
							<span className="text-vscode-cyan italic">enemy_attack</span> / 3)
							rounded down damage
						</p>
						<p>
							<span className="text-red-500">Enemy get:</span> 1 damage, stun for 2
							turns
						</p>
					</td>
					<td className="border-b border-l border-r p-2">
						<p>
							<span className="text-blue-500">You get:</span> (2 *{" "}
							<span className="text-vscode-cyan italic">enemy_attack</span>) damage
						</p>
						<p>
							<span className="text-red-500">Enemy get:</span> -
						</p>
					</td>
				</tr>

				<tr>
					<th className="border-b border-l">
						<span className="sideways">Block</span>
					</th>
					<td className="border-b border-l p-2">
						<p>
							<span className="text-blue-500">You get:</span> 1 damage, stun for 2
							turns
						</p>
						<p>
							<span className="text-red-500">Enemy get:</span> (
							<span className="text-vscode-cyan italic">your_attack</span> / 3)
							rounded down damage
						</p>
					</td>
					<td className="border-b border-l p-2">
						<p>
							<span className="text-blue-500">You get:</span> -
						</p>
						<p>
							<span className="text-red-500">Enemy get:</span> -
						</p>
					</td>
					<td className="border-b border-l border-r p-2">
						<p>
							<span className="text-blue-500">You get:</span> 1 attack
						</p>
						<p>
							<span className="text-red-500">Enemy get:</span> -
						</p>
					</td>
				</tr>
				<tr>
					<th className="border-b border-l">
						<span className="sideways">Upgrade</span>
					</th>
					<td className="border-b border-l p-2">
						<p>
							<span className="text-blue-500">You get:</span> -
						</p>
						<p>
							<span className="text-red-500">Enemy get:</span> (2 *{" "}
							<span className="text-vscode-cyan italic">your_attack</span>) damage
						</p>
					</td>
					<td className="border-b border-l p-2">
						<p>
							<span className="text-blue-500">You get:</span> -
						</p>
						<p>
							<span className="text-red-500">Enemy get:</span> 1 attack
						</p>
					</td>
					<td className="border-b border-l border-r p-2">
						<p>
							<span className="text-blue-500">You get:</span> 1 attack
						</p>
						<p>
							<span className="text-red-500">Enemy get:</span> 1 attack
						</p>
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default ActionResultsTable;
