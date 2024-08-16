import { Router } from "express";
import getEnemyBotData from "../enemyBots/getEnemyBotData";

const router = Router();

router.get("/", async (req, res) => {
	if (req.session.curLevel === undefined) {
		req.session.curLevel = 0;
	}

	const enemyBotDataResult = await getEnemyBotData(req.session.curLevel);
	if (enemyBotDataResult.result === "fail") {
		return res.status(enemyBotDataResult.statusCode).send(enemyBotDataResult.message);
	}
	res.send({ code: enemyBotDataResult.code, description: enemyBotDataResult.description });
});

router.get("/resetLevel", async (req, res) => {
	req.session.curLevel = 0;
	res.sendStatus(204);
});

export default router;
