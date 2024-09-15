import { Router, Request, Response, NextFunction } from "express";
import User from "../models/user";
import crypto from "crypto";
import { extractCurLevel, CurLevelRequest } from "../utils/extractCurLevel";

const router = Router();

interface AuthResult {
	status: "success" | "fail";
	usernameError: string | null;
	passwordError: string | null;
	alreadyLoggedIn: boolean;
}

export interface AuthRequest extends Request {
	username?: string;
	password?: string;
}

function checkAuthCreds(req: AuthRequest, res: Response, next: NextFunction) {
	const result: AuthResult = {
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

	if (result.status === "fail") return res.json(result);

	if (typeof req.body.username !== "string") {
		result.status = "fail";
		result.usernameError = "Username should be a string";
	}
	if (typeof req.body.password !== "string") {
		result.status = "fail";
		result.passwordError = "Password should be a string";
	}
	if (result.status === "fail") return res.json(result);

	const username = req.body.username as string;
	const password = req.body.password as string;

	if (username.length === 0) {
		result.status = "fail";
		result.usernameError = "Username is empty";
	}
	if (password.length === 0) {
		result.status = "fail";
		result.passwordError = "Password is empty";
	}
	if (result.status === "fail") return res.json(result);

	req.username = username;
	req.password = password;

	next();
}

router.post("/signup", checkAuthCreds, async (req: AuthRequest, res) => {
	const result: AuthResult = {
		status: "success",
		usernameError: null,
		passwordError: null,
		alreadyLoggedIn: false,
	};

	const username = req.username!;
	const password = req.password!;

	try {
		const existingUser = await User.findOne({ username });
		if (existingUser !== null) {
			result.status = "fail";
			result.usernameError = "This username is already taken";
			return res.json(result);
		}
	} catch (err) {
		let message;
		if (err instanceof Error) message = err.message;
		else message = String(err);

		console.error(err);
		return res.status(500).send({ error: message });
	}

	try {
		const salt = crypto.randomBytes(16).toString("hex");
		const passwordHashed = crypto.scryptSync(password, salt, 64).toString("hex");

		let curLevel = 0;
		if (req.session.curLevel !== undefined) {
			curLevel = req.session.curLevel;
		}

		const newUser = new User({
			username,
			password: { salt, value: passwordHashed },
			curLevel,
		});
		await newUser.save();
	} catch (err) {
		let message;
		if (err instanceof Error) message = err.message;
		else message = String(err);

		console.error(err);
		return res.status(500).send({ error: message });
	}

	req.session.user = { username };
	res.send(result);
});

router.post("/login", checkAuthCreds, async (req: AuthRequest, res) => {
	const result: AuthResult = {
		status: "success",
		usernameError: null,
		passwordError: null,
		alreadyLoggedIn: false,
	};

	const username = req.username!;
	const password = req.password!;

	try {
		const user = await User.findOne({ username });
		if (user === null) {
			result.status = "fail";
			result.usernameError = "This user does not exist";
			return res.json(result);
		}
		const hashedBuffer = crypto.scryptSync(password, user.password.salt, 64);
		const keyBuffer = Buffer.from(user.password.value, "hex");
		if (!crypto.timingSafeEqual(hashedBuffer, keyBuffer)) {
			result.status = "fail";
			result.passwordError = "Wrong password";
			return res.json(result);
		}
	} catch (err) {
		let message;
		if (err instanceof Error) message = err.message;
		else message = String(err);

		console.error(err);
		return res.status(500).send({ error: message });
	}

	req.session.user = { username };

	let newReq: CurLevelRequest;
	try {
		newReq = await extractCurLevel(req);
	} catch (err) {
		console.log(err);
		return res.status(500).send(String(err));
	}
	newReq.syncSessionLevelWithDB();

	res.send(result);
});

router.get("/signout", async (req, res) => {
	if (req.session.user === undefined) {
		return res.status(400).send("You are not signed in");
	}

	let newReq: CurLevelRequest;
	try {
		newReq = await extractCurLevel(req);
	} catch (err) {
		console.log(err);
		return res.status(500).send(String(err));
	}
	newReq.syncSessionLevelWithDB();

	delete req.session.user;
	res.sendStatus(200);
});

export default router;
