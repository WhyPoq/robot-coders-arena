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
const enemyBotsData_json_1 = __importDefault(require("./enemyBotsData.json"));
const node_path_1 = require("node:path");
const node_fs_1 = __importDefault(require("node:fs"));
function getEnemyBotData(level) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Number.isInteger(level)) {
            return { result: "fail", statusCode: 400, message: `Level ${level} is not an integer` };
        }
        if (level < 0 || level >= enemyBotsData_json_1.default.length) {
            return { result: "fail", statusCode: 404, message: `Level ${level} does not exist` };
        }
        const levelPath = (0, node_path_1.join)(__dirname, "..", "enemyBots", enemyBotsData_json_1.default[level].codeFile);
        let code;
        try {
            code = yield node_fs_1.default.promises.readFile(levelPath, "utf8");
        }
        catch (err) {
            console.error(err);
            return { result: "fail", statusCode: 500, message: "Error while reading bot code" };
        }
        const descriptionPath = (0, node_path_1.join)(__dirname, "..", "enemyBots", enemyBotsData_json_1.default[level].descriptionFile);
        let description;
        try {
            description = yield node_fs_1.default.promises.readFile(descriptionPath, "utf8");
        }
        catch (err) {
            console.error(err);
            return { result: "fail", statusCode: 500, message: "Error while reading bot desciption" };
        }
        return { result: "success", code, description };
    });
}
exports.default = getEnemyBotData;
//# sourceMappingURL=getEnemyBotData.js.map