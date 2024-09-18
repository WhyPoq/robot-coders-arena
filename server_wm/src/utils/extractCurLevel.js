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
exports.extractCurLevel = void 0;
const user_1 = __importDefault(require("../models/user"));
function extractCurLevel(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let curLevel;
        if (req.session.user) {
            try {
                const user = yield user_1.default.findOne({
                    username: req.session.user.username,
                });
                curLevel = user.curLevel;
            }
            catch (e) {
                throw new Error("Error while getting user's current level: " + String(e));
            }
        }
        else {
            if (req.session.curLevel === undefined) {
                req.session.curLevel = 0;
            }
            curLevel = req.session.curLevel;
        }
        let setCurLevel = (newCurLevel) => __awaiter(this, void 0, void 0, function* () {
            if (req.session.user) {
                try {
                    const user = yield user_1.default.findOne({
                        username: req.session.user.username,
                    });
                    user.curLevel = newCurLevel;
                    yield user.save();
                }
                catch (e) {
                    throw new Error("Error while setting user's current level: " + String(e));
                }
            }
            else {
                req.session.curLevel = newCurLevel;
                req.session.save();
            }
        });
        let syncSessionLevelWithDB = () => __awaiter(this, void 0, void 0, function* () {
            if (req.session.user) {
                try {
                    const user = yield user_1.default.findOne({
                        username: req.session.user.username,
                    });
                    req.session.curLevel = user.curLevel;
                    req.session.save();
                }
                catch (e) {
                    throw new Error("Error while setting user's current level: " + String(e));
                }
            }
        });
        const newReq = req;
        newReq.curLevel = curLevel;
        newReq.setCurLevel = setCurLevel;
        newReq.syncSessionLevelWithDB = syncSessionLevelWithDB;
        return newReq;
    });
}
exports.extractCurLevel = extractCurLevel;
//# sourceMappingURL=extractCurLevel.js.map