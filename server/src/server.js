"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const cors_1 = __importDefault(require("cors"));
const sockets_1 = __importDefault(require("./sockets"));
const express_session_1 = __importDefault(require("express-session"));
const enemyBots_1 = __importDefault(require("./routes/enemyBots"));
const authentication_1 = __importDefault(require("./routes/authentication"));
const connectDB_1 = __importDefault(require("./connectDB"));
const getUserInfo_1 = __importDefault(require("./routes/getUserInfo"));
dotenv_1.default.config();
const PORT = 4000;
const app = (0, express_1.default)();
const httpServer = (0, node_http_1.createServer)(app);
if (process.env.DB_URI === undefined)
    throw new Error("'DB_URI' is not defined in .env file");
(0, connectDB_1.default)(process.env.DB_URI);
app.use(express_1.default.json());
const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
const sessionMiddleware = (0, express_session_1.default)({
    secret: process.env.SESSIONS_SECRET,
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
app.use("/enemyBots", enemyBots_1.default);
app.use("/", authentication_1.default);
app.use("/userinfo", getUserInfo_1.default);
(0, sockets_1.default)(httpServer, sessionMiddleware, corsOptions);
httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
//# sourceMappingURL=server.js.map