import { ReactNode } from "react";

interface NormalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	size?: "normal" | "small";
}

const NormalButton = ({ children, size = "normal", ...props }: NormalButtonProps) => {
	props.className += " font-bold border-white border-2 rounded";

	if (size === "normal") props.className += " p-2 pl-3 pr-3 text-lg";
	else props.className += " p-1 pl-2 pr-2 text-base";

	return <button {...props}>{children}</button>;
};

export default NormalButton;
