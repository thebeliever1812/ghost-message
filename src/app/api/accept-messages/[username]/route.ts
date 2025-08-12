import connectMongoDb from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import z from "zod";

export async function GET(request:Request, {
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const UsernameSchema = z.object({
		username: usernameValidation,
	});

	try {
		const { username } = await params;

		if (!username) {
			return Response.json(
				{
					sucess: false,
					acceptingMessages: false,
				},
				{ status: 400 }
			);
		}

		const result = UsernameSchema.safeParse({username});

		if (!result.success) {
			return Response.json({
				success: false,
				acceptingMessages: false,
			});
		}

		const { username: usernameAfterValidation } = result.data;

		await connectMongoDb();

		const userExist = await UserModel.findOne({
			username: usernameAfterValidation,
			isVerified: true,
		});

		if (!userExist) {
			return Response.json(
				{
					sucess: false,
					acceptingMessages: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		return Response.json(
			{
				sucess: true,
                acceptingMessages: userExist.isAcceptingMessage
			},
			{ status: 200 }
		);
    } catch (error) {
		return Response.json(
            
			{
				sucess: false,
				acceptingMessages: false,
				message: "Something went wrong",
			},
			{ status: 500 }
		);
	}
}
