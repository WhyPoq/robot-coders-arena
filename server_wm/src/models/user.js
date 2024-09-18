"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        index: true,
    },
    password: {
        value: {
            type: String,
            require: true,
        },
        salt: {
            type: String,
            require: true,
        },
    },
    curLevel: {
        type: Number,
        require: true,
    },
});
exports.default = mongoose.model("User", userSchema);
//# sourceMappingURL=user.js.map