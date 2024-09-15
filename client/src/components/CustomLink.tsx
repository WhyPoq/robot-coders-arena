import { ReactNode, HTMLAttributes } from "react";
import { Link, To, useResolvedPath, useMatch } from "react-router-dom";

interface CustomLinkProps extends HTMLAttributes<HTMLAnchorElement> {
	to: To;
	children?: ReactNode;
}

const CustomLink = ({ to, children, className, ...props }: CustomLinkProps) => {
	const resolvedPath = useResolvedPath(to);
	const isActive = useMatch({ path: resolvedPath.pathname, end: true });
	return (
		<Link
			to={to}
			{...props}
			className={[
				className,
				"font-semibold hover:text-vscode-light-green transition-colors",
				isActive ? "text-vscode-cyan" : "",
			].join(" ")}
		>
			{children}
		</Link>
	);
};

export default CustomLink;
