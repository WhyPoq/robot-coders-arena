import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import initSockets from "./sockets";
import session from "express-session";
import SessionUser from "./types/sessionUser";
import connectDB from "./connectDB";
import path from "node:path";
import apiRouter from "./routes/api";

declare module "express-session" {
	interface SessionData {
		user: SessionUser | undefined;
		curLevel: number | undefined;
	}
}

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();
const httpServer = createServer(app);

if (process.env.DB_URI === undefined) throw new Error("'DB_URI' is not defined in .env file");
connectDB(process.env.DB_URI);

app.use(express.json());

const corsOptions = {
	origin: "*",
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

app.use(express.static(path.join(__dirname, "..", "public")));

initSockets(httpServer, sessionMiddleware, corsOptions);

app.use("/api", apiRouter);
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
