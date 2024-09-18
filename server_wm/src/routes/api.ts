import { Router } from "express";
import enemyBotsRouter from "./enemyBots";
import authenticationRouter from "./authentication";
import getUserInfoRouter from "./getUserInfo";

const router = Router();

router.use("/enemyBots", enemyBotsRouter);
router.use("/", authenticationRouter);
router.use("/userinfo", getUserInfoRouter);

export default router;
