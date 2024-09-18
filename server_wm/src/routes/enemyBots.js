"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const extractCurLevel_1 = require("../utils/extractCurLevel");
const getEnemyBotData_1 = __importDefault(require("../enemyBots/getEnemyBotData"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newReq;
    try {
        newReq = yield (0, extractCurLevel_1.extractCurLevel)(req);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send(String(err));
    }
    const enemyBotDataResult = yield (0, getEnemyBotData_1.default)(newReq.curLevel);
    if (enemyBotDataResult.result === "fail") {
        return res.status(enemyBotDataResult.statusCode).send(enemyBotDataResult.message);
    }
    if (!enemyBotDataResult.showCode)
        enemyBotDataResult.code = "";
    res.send({
        code: enemyBotDataResult.code,
        description: enemyBotDataResult.description,
        showCode: enemyBotDataResult.showCode,
    });
}));
router.get("/resetLevel", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newReq;
    try {
        newReq = yield (0, extractCurLevel_1.extractCurLevel)(req);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send(String(err));
    }
    newReq.setCurLevel(0);
    res.sendStatus(204);
}));
exports.default = router;
//# sourceMappingURL=enemyBots.js.map