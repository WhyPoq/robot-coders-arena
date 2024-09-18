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
const socket_io_1 = require("socket.io");
const compileBotCode_1 = __importDefault(require("./utils/compileBotCode"));
const getEnemyBotData_1 = __importDefault(require("./enemyBots/getEnemyBotData"));
const gameManager_1 = require("./gameManager");
const extractCurLevel_1 = require("./utils/extractCurLevel");
function initSockets(httpServer, sessionMiddleware, corsOptions) {
    const socketIO = new socket_io_1.Server(httpServer, {
        cors: corsOptions,
    });
    socketIO.engine.use(sessionMiddleware);
    socketIO.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
        console.log(`user with id ${socket.id} connected`);
        const req = socket.request;
        let newReq;
        try {
            newReq = yield (0, extractCurLevel_1.extractCurLevel)(req);
        }
        catch (err) {
            console.log(err);
            socket.disconnect();
            return;
        }
        let moveFn = null;
        let enemyMoveFn = null;
        socket.on("startFight", (_a) => __awaiter(this, [_a], void 0, function* ({ code }) {
            const compileResult = (0, compileBotCode_1.default)(code);
            if (compileResult.status === "success") {
                moveFn = compileResult.fn;
                const enemyDataResult = yield (0, getEnemyBotData_1.default)(newReq.curLevel);
                if (enemyDataResult.result === "fail") {
                    return socket.emit("compileError", "Server error: " + enemyDataResult.message);
                }
                const enemyCompileResult = (0, compileBotCode_1.default)(enemyDataResult.code);
                if (enemyCompileResult.status === "fail") {
                    socket.emit("consoleLinesError", [
                        "Error compiling enemy bots code: " + enemyCompileResult.message,
                    ]);
                    return socket.emit("compileError", "Enemy bot code error: " + enemyCompileResult.message);
                }
                enemyMoveFn = enemyCompileResult.fn;
                socket.emit("compiledSuccessfully");
                setTimeout(() => (0, gameManager_1.startGame)(socket, moveFn, enemyMoveFn, newReq), 1000);
            }
            else {
                socket.emit("consoleLinesError", [compileResult.message]);
                socket.emit("compileError", compileResult.message);
            }
        }));
        socket.on("disconnect", () => {
            console.log(`user with id ${socket.id} disconnected`);
        });
    }));
}
exports.default = initSockets;
//# sourceMappingURL=sockets.js.map