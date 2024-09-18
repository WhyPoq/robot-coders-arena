"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enemyBots_1 = __importDefault(require("./enemyBots"));
const authentication_1 = __importDefault(require("./authentication"));
const getUserInfo_1 = __importDefault(require("./getUserInfo"));
const router = (0, express_1.Router)();
router.use("/enemyBots", enemyBots_1.default);
router.use("/", authentication_1.default);
router.use("/userinfo", getUserInfo_1.default);
exports.default = router;
//# sourceMappingURL=api.js.map