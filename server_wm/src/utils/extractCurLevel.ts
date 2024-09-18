import { Request } from "express";
import User from "../models/user";
import { IUser } from "../models/user";
import { HydratedDocument } from "mongoose";

export interface CurLevelRequest extends Request {
	curLevel: number;
	setCurLevel: (newCurLevel: number) => Promise<void>;
	syncSessionLevelWithDB: () => Promise<void>;
}

export async function extractCurLevel(req: Request) {
	let curLevel;

	if (req.session.user) {
		try {
			const user: HydratedDocument<IUser> = await User.findOne({
				username: req.session.user.username,
			});
			curLevel = user.curLevel;
		} catch (e) {
			throw new Error("Error while getting user's current level: " + String(e));
		}
	} else {
		if (req.session.curLevel === undefined) {
			req.session.curLevel = 0;
		}
		curLevel = req.session.curLevel;
	}

	let setCurLevel = async (newCurLevel: number) => {
		if (req.session.user) {
			try {
				const user: HydratedDocument<IUser> = await User.findOne({
					username: req.session.user.username,
				});
				user.curLevel = newCurLevel;
				await user.save();
			} catch (e) {
				throw new Error("Error while setting user's current level: " + String(e));
			}
		} else {
			req.session.curLevel = newCurLevel;
			req.session.save();
		}
	};

	let syncSessionLevelWithDB = async () => {
		if (req.session.user) {
			try {
				const user: HydratedDocument<IUser> = await User.findOne({
					username: req.session.user.username,
				});
				req.session.curLevel = user.curLevel;
				req.session.save();
			} catch (e) {
				throw new Error("Error while setting user's current level: " + String(e));
			}
		}
	};

	const newReq = req as CurLevelRequest;
	newReq.curLevel = curLevel;
	newReq.setCurLevel = setCurLevel;
	newReq.syncSessionLevelWithDB = syncSessionLevelWithDB;

	return newReq;
}
