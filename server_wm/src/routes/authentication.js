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
const express_1 = require("express");
const user_1 = __importDefault(require("../models/user"));
const crypto_1 = __importDefault(require("crypto"));
const extractCurLevel_1 = require("../utils/extractCurLevel");
const router = (0, express_1.Router)();
function checkAuthCreds(req, res, next) {
    const result = {
        status: "success",
        usernameError: null,
        passwordError: null,
        alreadyLoggedIn: false,
    };
    if (req.session.user !== undefined) {
        result.status = "fail";
        result.alreadyLoggedIn = true;
        return res.json(result);
    }
    if (req.body.username === undefined) {
        result.status = "fail";
        result.usernameError = "Username was not provided";
    }
    if (req.body.password === undefined) {
        result.status = "fail";
        result.passwordError = "Password was not provided";
    }
    if (result.status === "fail")
        return res.json(result);
    if (typeof req.body.username !== "string") {
        result.status = "fail";
        result.usernameError = "Username should be a string";
    }
    if (typeof req.body.password !== "string") {
        result.status = "fail";
        result.passwordError = "Password should be a string";
    }
    if (result.status === "fail")
        return res.json(result);
    const username = req.body.username;
    const password = req.body.password;
    if (username.length === 0) {
        result.status = "fail";
        result.usernameError = "Username is empty";
    }
    if (password.length === 0) {
        result.status = "fail";
        result.passwordError = "Password is empty";
    }
    if (result.status === "fail")
        return res.json(result);
    req.username = username;
    req.password = password;
    next();
}
router.post("/signup", checkAuthCreds, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = {
        status: "success",
        usernameError: null,
        passwordError: null,
        alreadyLoggedIn: false,
    };
    const username = req.username;
    const password = req.password;
    try {
        const existingUser = yield user_1.default.findOne({ username });
        if (existingUser !== null) {
            result.status = "fail";
            result.usernameError = "This username is already taken";
            return res.json(result);
        }
    }
    catch (err) {
        let message;
        if (err instanceof Error)
            message = err.message;
        else
            message = String(err);
        console.error(err);
        return res.status(500).send({ error: message });
    }
    try {
        const salt = crypto_1.default.randomBytes(16).toString("hex");
        const passwordHashed = crypto_1.default.scryptSync(password, salt, 64).toString("hex");
        let curLevel = 0;
        if (req.session.curLevel !== undefined) {
            curLevel = req.session.curLevel;
        }
        const newUser = new user_1.default({
            username,
            password: { salt, value: passwordHashed },
            curLevel,
        });
        yield newUser.save();
    }
    catch (err) {
        let message;
        if (err instanceof Error)
            message = err.message;
        else
            message = String(err);
        console.error(err);
        return res.status(500).send({ error: message });
    }
    req.session.user = { username };
    res.send(result);
}));
router.post("/login", checkAuthCreds, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = {
        status: "success",
        usernameError: null,
        passwordError: null,
        alreadyLoggedIn: false,
    };
    const username = req.username;
    const password = req.password;
    try {
        const user = yield user_1.default.findOne({ username });
        if (user === null) {
            result.status = "fail";
            result.usernameError = "This user does not exist";
            return res.json(result);
        }
        const hashedBuffer = crypto_1.default.scryptSync(password, user.password.salt, 64);
        const keyBuffer = Buffer.from(user.password.value, "hex");
        if (!crypto_1.default.timingSafeEqual(hashedBuffer, keyBuffer)) {
            result.status = "fail";
            result.passwordError = "Wrong password";
            return res.json(result);
        }
    }
    catch (err) {
        let message;
        if (err instanceof Error)
            message = err.message;
        else
            message = String(err);
        console.error(err);
        return res.status(500).send({ error: message });
    }
    req.session.user = { username };
    let newReq;
    try {
        newReq = yield (0, extractCurLevel_1.extractCurLevel)(req);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send(String(err));
    }
    newReq.syncSessionLevelWithDB();
    res.send(result);
}));
router.get("/signout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user === undefined) {
        return res.status(400).send("You are not signed in");
    }
    let newReq;
    try {
        newReq = yield (0, extractCurLevel_1.extractCurLevel)(req);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send(String(err));
    }
    newReq.syncSessionLevelWithDB();
    delete req.session.user;
    res.sendStatus(200);
}));
exports.default = router;
//# sourceMappingURL=authentication.js.map