"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function connectDB(dbUri) {
    mongoose_1.default.connect(dbUri);
    const db = mongoose_1.default.connection;
    db.on("error", (error) => console.log("DB error:", error));
    db.once("open", () => console.log("Connected to database"));
    return db;
}
exports.default = connectDB;
//# sourceMappingURL=connectDB.js.map