import { useEffect } from "react";
import { useUserContext } from "../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";

const MyBotsPage = () => {
	const { username } = useUserContext();
	const navigate = useNavigate();

	useEffect(() => {
		if (username === null) {
			navigate("/login");
		}
	}, [username, navigate]);

	if (username === undefined || username === null) {
		return <div></div>;
	}

	return (
		<div className="h-full relative bg-vscode-editor-background text-white font-normal">
			<h1>My Bots</h1>
			<div>
				<div>
					<Link to="/mybots/random">Bot 1</Link>
				</div>
				<div>
					<p>Bot 2</p>
				</div>
			</div>
		</div>
	);
};

export default MyBotsPage;
