import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import initSockets from "./sockets";
import enemyBotsRouter from "./routes/enemyBots";
import session from "express-session";

declare module "express-session" {
	interface SessionData {
		curLevel: number | undefined;
	}
}

dotenv.config();
const PORT = 4000;

const app = express();
const httpServer = createServer(app);

const corsOptions = {
	origin: ["http://localhost:5173"],
	credentials: true,
};

app.use(cors(corsOptions));

const sessionMiddleware = session({
	secret: process.env.SESSIONS_SECRET!,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: process.env.DEVELOPMENT === "false", // false  - for development, true - for release
		httpOnly: true,
		sameSite: process.env.DEVELOPMENT === "true" ? "none" : "strict",
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
	},
});

app.use(sessionMiddleware);

app.get("/", (req, res) => {
	res.json({
		message: "Hello from server",
	});
});

app.use("/enemyBots", enemyBotsRouter);

initSockets(httpServer, sessionMiddleware, corsOptions);

httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
