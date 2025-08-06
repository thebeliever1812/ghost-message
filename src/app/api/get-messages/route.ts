import connectMongoDb from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import UserModel from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import mongoose from "mongoose";

export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		const sessionUser = session?.user as User;

		if (!session || !session.user) {
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

		const user = await UserModel.aggregate([
			{ $match: { _id: userId } },
			{ $unwind: "$messages" }, // jab bhi ham mongodb ka internal parameter use krte hai we can directly add it in '$paramater_name'
			{ $sort: { "messages.createdAt": -1 } },
			{ $group: { _id: "$_id", messages: { $push: "$messages" } } },
		]);

		if (!user || user.length === 0) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		return Response.json(
			{
				success: true,
				messages: user[0].messages
			},
			{ status: 200 }
		);
	} catch (error) {
		return Response.json(
			{
				success: false,
				message: "Failed to get the messages",
			},
			{ status: 500 }
		);
	}
}
