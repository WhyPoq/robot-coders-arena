import mrFresh from "../assets/mr_fresh.gif";

const NotFoundPage = () => {
	return (
		<div className="h-full relative bg-vscode-editor-background text-white font-normal flex items-center justify-center">
			<div className="flex flex-col items-center">
				<h1 className="font-semibold text-3xl mb-5">Page Not Found</h1>
				<div className="max-w-80 w-[90%]">
					<img className="rounded" src={mrFresh} alt=":(" />
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;
