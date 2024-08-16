import enemyBotsData from "./enemyBotsData.json";
import { join } from "node:path";
import fs from "node:fs";

interface getEnemyBotDataSuccess {
	result: "success";
	code: string;
	description: string;
}

interface getEnemyBotDataFail {
	result: "fail";
	statusCode: number;
	message: string;
}

type getEnemyBotDataResult = getEnemyBotDataSuccess | getEnemyBotDataFail;

async function getEnemyBotData(level: number): Promise<getEnemyBotDataResult> {
	if (!Number.isInteger(level)) {
		return { result: "fail", statusCode: 400, message: `Level ${level} is not an integer` };
	}

	if (level < 0 || level >= enemyBotsData.length) {
		return { result: "fail", statusCode: 404, message: `Level ${level} does not exist` };
	}

	const levelPath = join(__dirname, "..", "enemyBots", enemyBotsData[level].codeFile);
	let code;
	try {
		code = await fs.promises.readFile(levelPath, "utf8");
	} catch (err) {
		console.error(err);
		return { result: "fail", statusCode: 500, message: "Error while reading bot code" };
	}

	const descriptionPath = join(
		__dirname,
		"..",
		"enemyBots",
		enemyBotsData[level].descriptionFile
	);
	let description;
	try {
		description = await fs.promises.readFile(descriptionPath, "utf8");
	} catch (err) {
		console.error(err);
		return { result: "fail", statusCode: 500, message: "Error while reading bot desciption" };
	}

	return { result: "success", code, description };
}

export default getEnemyBotData;
