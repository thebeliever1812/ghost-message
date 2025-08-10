import connectMongoDb from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import UserModel from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		const user = session?.user as User;

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

		const userId = user._id;
		const { acceptMessages: isUserAcceptingMessages } = await request.json();

		const result = acceptMessageSchema.safeParse({
			acceptMessages: isUserAcceptingMessages,
		});

		if (!result.success) {
			return Response.json({
				success: result.success,
				message: result.error.issues[0].message,
			});
		}

		console.log("Result.data: ",result.data)
		const { acceptMessages } = result.data;

		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{ isAcceptingMessage: acceptMessages },
			{ new: true }
		);

		if (!updatedUser) {
			return Response.json(
				{
					success: false,
					message: "Failed to update the status of accepting message",
				},
				{ status: 401 }
			);
		}

		return Response.json(
			{
				success: true,
				message: "Changed status successfully",
				updatedUser,
			},
			{ status: 200 }
		);
	} catch (error) {
		return Response.json(
			{
				success: false,
				message: "Failed to update the status of accepting message",
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		const user = session?.user as User;

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

		const userId = user._id;

		const userFound = await UserModel.findById(userId);

		if (!userFound) {
			return Response.json(
				{
					success: false,
					message: "Failed to found the user",
				},
				{ status: 404 }
			);
		}

		return Response.json(
			{
				success: true,
				isAcceptingMessages: userFound.isAcceptingMessage,
			},
			{ status: 200 }
		);
	} catch (error) {
		return Response.json(
			{
				success: false,
				message: "Failed to get the status of accepting message",
			},
			{ status: 500 }
		);
	}
}
