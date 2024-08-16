import { useCallback, useState } from "react";

const PROJECT_ID = "robot-coders-arena";

function setItem<T>(key: string, value: T) {
	if (typeof value !== "string") localStorage.setItem(key, JSON.stringify(value));
	else localStorage.setItem(key, value);
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
	key = PROJECT_ID + "-" + key;
	const [value, setValue] = useState<T>(() => {
		const storageItem = localStorage.getItem(key);
		if (storageItem !== null) {
			if (typeof defaultValue !== "string") return JSON.parse(storageItem);
			return storageItem;
		}

		setItem(key, defaultValue);
		return defaultValue;
	});

	const setStorageValue = useCallback(
		(value: T) => {
			setItem(key, value);
			setValue(value);
		},
		[key, setValue]
	);

	return [value, setStorageValue] as [T, (newVal: T) => void];
}
