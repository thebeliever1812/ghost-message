import connectMongoDb from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import UserModel from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import mongoose from "mongoose";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		const sessionUser = session?.user as User;

		if (!session || !sessionUser) {
			return Response.json(
				{
					success: false,
					message: "Not authenticated",
				},
				{ status: 400 }
			);
		}

		await connectMongoDb();

		const userId = new mongoose.Types.ObjectId(sessionUser._id);

		const messages = await UserModel.aggregate([
			{ $match: { _id: userId } },
			{ $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } }, // jab bhi ham mongodb ka internal parameter use krte hai we can directly add it in '$paramater_name'
			{
				$lookup: {
					from: "messages", // collection name (lowercase & plural usually)
					localField: "messages",
					foreignField: "_id",
					as: "messages",
				},
			},
			{ $unwind: "$messages" },
			{ $sort: { "messages.createdAt": -1 } },
			{ $group: { _id: "$_id", messages: { $push: "$messages" } } },
		]);

		if (!messages || messages.length === 0) {
			return Response.json(
				{
					success: false,
					message: "Messages not found",
				},
				{ status: 404 }
			);
		}
		
		return Response.json(
			{
				success: true,
				messages: messages[0].messages,
			},
			{ status: 200 }
		);
	} catch {
		return Response.json(
			{
				success: false,
				message: "Failed to get the messages",
			},
			{ status: 500 }
		);
	}
}
