import { Server } from "socket.io";
import { Server as HttpServer } from "node:http";
import compileBotCode from "./utils/compileBotCode";
import getEnemyBotData from "./enemyBots/getEnemyBotData";
import { startGame } from "./gameManager";
import { RequestHandler } from "express";
import { Request } from "express-serve-static-core";
import { CurLevelRequest, extractCurLevel } from "./utils/extractCurLevel";
import { FunctionFromSeclang } from "seclang/sandbox";
import { SeclangFunction } from "seclang/core";

function initSockets(httpServer: HttpServer, sessionMiddleware: RequestHandler, corsOptions: any) {
	const socketIO = new Server(httpServer, {
		cors: corsOptions,
	});

	socketIO.engine.use(sessionMiddleware);

	socketIO.on("connection", async (socket) => {
		console.log(`user with id ${socket.id} connected`);
		const req = socket.request as Request;

		let newReq: CurLevelRequest;
		try {
			newReq = await extractCurLevel(req);
		} catch (err) {
			console.log(err);
			socket.disconnect();
			return;
		}

		let moveFn: SeclangFunction | null = null;
		let enemyMoveFn: SeclangFunction | null = null;

		socket.on("startFight", async ({ code }: { code: string }) => {
			const compileResult = compileBotCode(code);
			if (compileResult.status === "success") {
				moveFn = compileResult.fn;

				const enemyDataResult = await getEnemyBotData(newReq.curLevel);
				if (enemyDataResult.result === "fail") {
					return socket.emit("compileError", "Server error: " + enemyDataResult.message);
				}
				const enemyCompileResult = compileBotCode(enemyDataResult.code);
				if (enemyCompileResult.status === "fail") {
					socket.emit("consoleLinesError", [
						"Error compiling enemy bots code: " + enemyCompileResult.message,
					]);
					return socket.emit(
						"compileError",
						"Enemy bot code error: " + enemyCompileResult.message
					);
				}
				enemyMoveFn = enemyCompileResult.fn;

				socket.emit("compiledSuccessfully");
				setTimeout(() => startGame(socket, moveFn!, enemyMoveFn!, newReq), 1000);
			} else {
				socket.emit("consoleLinesError", [compileResult.message]);
				socket.emit("compileError", compileResult.message);
			}
		});

		socket.on("disconnect", () => {
			console.log(`user with id ${socket.id} disconnected`);
		});
	});
}

export default initSockets;
