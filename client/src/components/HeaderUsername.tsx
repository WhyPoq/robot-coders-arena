import { useCallback, useState } from "react";
import dropdownArrow from "../assets/dorpdown_arrow.svg";
import dropdownArrowClose from "../assets/dropdown_arrow_close.svg";
import { serverUrl } from "../constants";
import { useUserContext } from "../contexts/UserContext";

interface HeaderUsernameProps {
	username: string;
}

const HeaderUsername = ({ username }: HeaderUsernameProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const { setUsername } = useUserContext();

	const signOut = useCallback(async () => {
		try {
			const res = await fetch(`${serverUrl}/signout`, {
				credentials: "include",
			});

			if (!res.ok) {
				let errorMessage;

				try {
					const errorText = await res.text();
					errorMessage = errorText ?? res.statusText;
				} catch (parseErr) {
					errorMessage = res.statusText;
				}

				throw new Error(`status ${res.status}, ${errorMessage}`);
			}

			setIsOpen(false);
			setUsername(null);
		} catch (err) {
			let errMessage = undefined;
			if (err instanceof Error) errMessage = err.message;
			else errMessage = String(err);

			console.error("Error while signing out:", errMessage);
		}
	}, [setIsOpen, setUsername]);

	return (
		<div className="relative">
			<button className="flex items-center select-text" onClick={() => setIsOpen(!isOpen)}>
				<p>{username}</p>
				<img
					className="relative top-[0.15rem]"
					src={isOpen ? dropdownArrowClose : dropdownArrow}
					alt={isOpen ? "close dropdown" : "open dropdown"}
				/>
			</button>

			{isOpen && (
				<div className="mt-1 rounded absolute z-20 bg-vscode-editor-background border border-white flex items-center left-1/2 -translate-x-1/2">
					<button
						className="whitespace-nowrap text-sm p-2 hover:text-vscode-cyan transition-colors"
						onClick={signOut}
					>
						Sign out
					</button>
				</div>
			)}
		</div>
	);
};

export default HeaderUsername;
