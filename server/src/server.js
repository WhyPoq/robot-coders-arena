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
const connectDB_1 = __importDefault(require("./connectDB"));
const node_path_1 = __importDefault(require("node:path"));
const api_1 = __importDefault(require("./routes/api"));
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
const app = (0, express_1.default)();
const httpServer = (0, node_http_1.createServer)(app);
if (process.env.DB_URI === undefined)
    throw new Error("'DB_URI' is not defined in .env file");
(0, connectDB_1.default)(process.env.DB_URI);
app.use(express_1.default.json());
const corsOptions = {
    origin: "*",
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
app.use(express_1.default.static(node_path_1.default.join(__dirname, "..", "public")));
(0, sockets_1.default)(httpServer, sessionMiddleware, corsOptions);
app.use("/api", api_1.default);
app.get("*", (req, res) => {
    res.sendFile(node_path_1.default.join(__dirname, "..", "public", "index.html"));
});
httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
//# sourceMappingURL=server.js.map