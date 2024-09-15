const mongoose = require("mongoose");

export interface IUser {
	username: string;
	password: {
		value: string;
		salt: string;
	};
	curLevel: number;
}

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

export default mongoose.model("User", userSchema);
