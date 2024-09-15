import mongoose from "mongoose";

function connectDB(dbUri: string) {
	mongoose.connect(dbUri);
	const db = mongoose.connection;
	db.on("error", (error) => console.log("DB error:", error));
	db.once("open", () => console.log("Connected to database"));

	return db;
}

export default connectDB;
