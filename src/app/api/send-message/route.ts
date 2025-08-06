import connectMongoDb from "@/lib/dbConnect";
import { Message } from "@/models/Message";
import UserModel from "@/models/User";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(request: Request) {
	try {
		const { username, messageContent } = await request.json();
		if (!username || !messageContent) {
			return Response.json(
				{
					success: false,
					message: "All fields are required",
				},
				{ status: 400 }
			);
		}

		await connectMongoDb();

		const user = await UserModel.findOne({ username });
		if (!user) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		const result = messageSchema.safeParse({ content: messageContent });

		if (!result.success) {
			return Response.json({
				success: result.success,
				message: result.error.issues[0].message,
			});
		}

		const { content } = result.data;
		const newMessage = { content };

		user.messages.push(newMessage as Message);
		await user.save();

		return Response.json(
			{
				success: true,
				message: "Message sent successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		return Response.json(
			{
				success: false,
				message: "Unable to send message",
			},
			{ status: 500 }
		);
	}
}
