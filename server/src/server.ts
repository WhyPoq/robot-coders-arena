import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import initSockets from "./sockets";
import session from "express-session";
import enemyBotsRouter from "./routes/enemyBots";
import authenticationRouter from "./routes/authentication";
import SessionUser from "./types/sessionUser";
import connectDB from "./connectDB";
import getUserInfoRouter from "./routes/getUserInfo";

declare module "express-session" {
	interface SessionData {
		user: SessionUser | undefined;
		curLevel: number | undefined;
	}
}

dotenv.config();
const PORT = 4000;

const app = express();
const httpServer = createServer(app);

if (process.env.DB_URI === undefined) throw new Error("'DB_URI' is not defined in .env file");
connectDB(process.env.DB_URI);

app.use(express.json());

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
		secure: process.env.DEVELOPMENT === "true" ? false : true, // false  - for development, true - for release
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
app.use("/", authenticationRouter);
app.use("/userinfo", getUserInfoRouter);

initSockets(httpServer, sessionMiddleware, corsOptions);

httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
