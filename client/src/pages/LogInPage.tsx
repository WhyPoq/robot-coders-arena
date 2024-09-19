import { useState, useCallback } from "react";
import InputField from "../components/InputField";
import { serverUrl } from "../constants";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import NormalLink from "../components/NormalLink";

interface AuthResult {
	status: "success" | "fail";
	usernameError: string | null;
	passwordError: string | null;
	alreadyLoggedIn: boolean;
}

const LogInPage = () => {
	const [usernameValue, setUsernameValue] = useState("");
	const [passwordValue, setPasswordValue] = useState("");

	const [usernameError, setUsernameError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);

	const [globalError, setGlobalError] = useState<string | null>(null);

	const navigate = useNavigate();
	const { setUsername } = useUserContext();

	const isFormDataCorrect = useCallback(() => {
		setUsernameError(null);
		setPasswordError(null);
		setGlobalError(null);

		let correct = true;
		if (usernameValue.length === 0) {
			setUsernameError("Username is empty");
			correct = false;
		}
		if (passwordValue.length === 0) {
			setPasswordError("Password is empty");
			correct = false;
		}
		return correct;
	}, [usernameValue, passwordValue, setUsernameError, setPasswordError]);

	const handleSubmit = useCallback(
		(e: React.SyntheticEvent<HTMLFormElement>) => {
			async function sendFormData() {
				try {
					const response = await fetch(`${serverUrl}/login`, {
						method: "POST",
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							username: usernameValue,
							password: passwordValue,
						}),
						credentials: "include",
					});

					if (!response.ok) {
						throw new Error(response.statusText);
					}

					const result = (await response.json()) as AuthResult;
					if (result.status === "fail") {
						setUsernameError(result.usernameError);
						setPasswordError(result.passwordError);

						if (result.alreadyLoggedIn) {
							setGlobalError("You are already logged in");
						}
					} else {
						setUsername(usernameValue);
						setTimeout(() => {
							const referrer = document.referrer;
							// Check if the referrer is from the same origin (same website)
							if (referrer && new URL(referrer).origin === window.location.origin) {
								navigate(-1);
							} else {
								navigate("/");
							}
						}, 100);
					}
				} catch (e) {
					console.error(e);
					setGlobalError("Unexpected error. Try again");
				}
			}

			e.preventDefault();
			if (isFormDataCorrect()) sendFormData();
		},
		[usernameValue, passwordValue, setUsernameError, setPasswordError, isFormDataCorrect]
	);

	return (
		<div className="h-full relative bg-vscode-editor-background text-white font-normal">
			<form className="flex flex-col items-center p-8" onSubmit={handleSubmit}>
				<h1 className="font-semibold text-3xl mb-5">Log In</h1>
				<div className="flex flex-col gap-6 w-full max-w-[20rem] items-stretch">
					<InputField
						name="Username"
						error={usernameError}
						value={usernameValue}
						setValue={setUsernameValue}
					/>
					<InputField
						name="Password"
						error={passwordError}
						value={passwordValue}
						setValue={setPasswordValue}
						type="password"
					/>
				</div>
				<input
					type="submit"
					className="font-bold text-white border-2 border-vscode-cyan rounded p-2 pl-6 pr-6 mt-8 hover:cursor-pointe hover:text-vscode-cyan"
					value="Log In"
				/>
				{globalError && <p className="text-red-500 text-xl mt-6">{globalError}</p>}
			</form>
			<p className="text-center mt-5">
				Do not have an account? <NormalLink to="/signup">Sign Up</NormalLink>
			</p>
		</div>
	);
};

export default LogInPage;
