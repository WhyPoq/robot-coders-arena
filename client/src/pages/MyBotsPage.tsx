import { useEffect } from "react";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

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
		<div className="h-full relative bg-vscode-editor-background text-white font-normal p-4">
			<h1>My bots (Not yet implemented)</h1>
		</div>
	);
};

export default MyBotsPage;
