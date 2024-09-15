import { useEffect } from "react";
import { useFlexibleItemContext } from "../../contexts/FlexibleItemContext";

interface OnResizeItemProps {
	onResizeCallback: (portion: number) => any;
}

const OnResizeItem = ({ onResizeCallback }: OnResizeItemProps) => {
	const { portion } = useFlexibleItemContext();
	useEffect(() => {
		onResizeCallback(portion);
	}, [portion]);
	return <></>;
};

export default OnResizeItem;
