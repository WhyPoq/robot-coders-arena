import { Server } from "socket.io";
import { Server as HttpServer } from "node:http";
import compileBotCode from "./utils/compileBotCode";
import getEnemyBotData from "./enemyBots/getEnemyBotData";
import { startGame } from "./gameManager";
import { RequestHandler } from "express";
import { Request } from "express-serve-static-core";

function initSockets(httpServer: HttpServer, sessionMiddleware: RequestHandler, corsOptions: any) {
	const socketIO = new Server(httpServer, {
		cors: corsOptions,
	});

	socketIO.engine.use(sessionMiddleware);

	socketIO.on("connection", async (socket) => {
		console.log(`user with id ${socket.id} connected`);
		const req = socket.request as Request;
		console.log("connected with level value", req.session.curLevel);

		let moveFn: Function | null = null;
		let __output: string[] = [];
		let enemyMoveFn: Function | null = null;

		if (req.session.curLevel === undefined) {
			req.session.curLevel = 0;
		}

		socket.on("startFight", async ({ code }: { code: string }) => {
			const compileResult = compileBotCode(code);
			if (compileResult.status === "success") {
				moveFn = compileResult.fn;
				__output = compileResult.__output;

				const enemyDataResult = await getEnemyBotData(req.session.curLevel!);
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
				setTimeout(() => startGame(socket, moveFn!, __output, enemyMoveFn!, req), 1000);
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
