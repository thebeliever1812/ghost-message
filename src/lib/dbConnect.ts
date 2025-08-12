import mongoose from "mongoose";
import { exit } from "process";

let isConnected = false;

async function connectMongoDb(): Promise<void> {
	if (isConnected) {
		return;
	}

	try {
		const connection = await mongoose.connect(
			process.env.MONGODB_URI || "mongodb://localhost:27017/ghostmessage",
			{
				dbName: "ghostmessage",
			}
		);
		isConnected = !!connection.connections[0].readyState;
	} catch {
		exit(1);
	}
}

export default connectMongoDb;
