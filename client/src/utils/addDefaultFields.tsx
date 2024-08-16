export function addDefaultsFields(
	targetObj: { [key: string]: any },
	defaultFields: { [key: string]: any }
) {
	for (const key in defaultFields) {
		if (targetObj[key] === undefined) {
			targetObj[key] = defaultFields[key];
		}
	}
}
