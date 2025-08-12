import connectMongoDb from "@/lib/dbConnect";
import MessageModel from "@/models/Message";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import UserModel from "@/models/User";

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ messageId: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		const user = session?.user as User;

		if (!session || !user) {
			return Response.json({
				success: false,
				message: "You are not authenticated",
			});
		}

		const { messageId } = await params;

		if (!messageId) {
			return Response.json(
				{
					success: false,
					message: "Message cannot be deleted",
				},
				{ status: 400 }
			);
		}

		await connectMongoDb();

		const deleteMessage = await MessageModel.findByIdAndDelete(messageId);

		if (!deleteMessage) {
			return Response.json(
				{ success: false, message: "Message not found" },
				{ status: 404 }
			);
		}

		await UserModel.findOneAndUpdate(
			{
				_id: user.id,
				messages: messageId,
			},
			{ $pull: { messages: messageId } }
		);

		return Response.json(
			{
				success: true,
				message: "Message Deleted Sucessfully",
			},
			{ status: 200 }
		);
	} catch {
		return Response.json(
			{
				success: false,
				message: "Something went wrong",
			},
			{ status: 500 }
		);
	}
}
