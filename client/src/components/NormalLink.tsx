import { ReactNode, HTMLAttributes } from "react";
import { Link, To } from "react-router-dom";

interface NormalLinkProps extends HTMLAttributes<HTMLAnchorElement> {
	to: To;
	children?: ReactNode;
}

const NormalLink = ({ to, children, className, ...props }: NormalLinkProps) => {
	return (
		<Link
			to={to}
			{...props}
			className={[className, "text-vscode-blue hover:text-vscode-cyan underline"].join(" ")}
		>
			{children}
		</Link>
	);
};

export default NormalLink;
