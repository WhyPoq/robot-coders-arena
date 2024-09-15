import { Router, Request } from "express";
import { extractCurLevel, CurLevelRequest } from "../utils/extractCurLevel";
import getEnemyBotData from "../enemyBots/getEnemyBotData";

const router = Router();

router.get("/", async (req: Request, res) => {
	let newReq: CurLevelRequest;
	try {
		newReq = await extractCurLevel(req);
	} catch (err) {
		console.log(err);
		return res.status(500).send(String(err));
	}

	const enemyBotDataResult = await getEnemyBotData(newReq.curLevel);
	if (enemyBotDataResult.result === "fail") {
		return res.status(enemyBotDataResult.statusCode).send(enemyBotDataResult.message);
	}

	if (!enemyBotDataResult.showCode) enemyBotDataResult.code = "";

	res.send({
		code: enemyBotDataResult.code,
		description: enemyBotDataResult.description,
		showCode: enemyBotDataResult.showCode,
	});
});

router.get("/resetLevel", async (req, res) => {
	let newReq: CurLevelRequest;
	try {
		newReq = await extractCurLevel(req);
	} catch (err) {
		console.log(err);
		return res.status(500).send(String(err));
	}
	newReq.setCurLevel(0);
	res.sendStatus(204);
});

export default router;
