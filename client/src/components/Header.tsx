import { useEffect } from "react";
import { useUserContext } from "../contexts/UserContext";
import CustomLink from "./CustomLink";
import { serverUrl } from "../constants";
import HeaderUsername from "./HeaderUsername";

interface getUserInfoResult {
	username: string | null;
}

const Header = () => {
	const { username, setUsername } = useUserContext();

	useEffect(() => {
		async function fetchUsername() {
			try {
				const res = await fetch(`${serverUrl}/userinfo`, { credentials: "include" });
				if (!res.ok) {
					throw new Error(res.statusText);
				}
				const data = (await res.json()) as getUserInfoResult;
				setUsername(data.username);
			} catch (err) {
				console.error(err);
			}
		}

		fetchUsername();
	}, [setUsername]);

	return (
		<header className="h-10 ">
			<nav className="h-full text-white flex justify-between border-b border-gray-500 pl-8 pr-8 bg-vscode-editor-background">
				<div className="flex items-center gap-5">
					<CustomLink to="/">
						<strong className="font-semibold mr-4 uppercase">Robot Coders Arena</strong>
					</CustomLink>
					<CustomLink to="/leaderboard">Leaderboard</CustomLink>
					<CustomLink to="/mybots">My bots</CustomLink>
				</div>
				<div className="flex justify-end items-center gap-3">
					{username ? (
						<HeaderUsername username={username} />
					) : (
						<>
							<CustomLink to="/login">Log in</CustomLink>
							<span className="opacity-80">or</span>
							<CustomLink to="/signup">Sign up</CustomLink>
						</>
					)}
				</div>
			</nav>
		</header>
	);
};

export default Header;
