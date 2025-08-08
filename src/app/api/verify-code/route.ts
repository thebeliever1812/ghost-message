import connectMongoDb from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
	try {
		const { username, userInputCode } = await request.json();
		if (!userInputCode) {
			return Response.json(
				{
					success: false,
					message: "Enter code to verify",
				},
				{ status: 400 }
			);
		}
		const result = verifySchema.safeParse({
			code: userInputCode,
		});

		if (!result.success) {
			return Response.json({
				success: result.success,
				message: result.error.issues[0].message,
			});
		}

		const { code } = result.data;

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
		if (user.isVerified) {
			return Response.json(
				{
					success: false,
					message: "User already Verified",
				},
				{ status: 404 }
			);
		}
		const isVerified = user.verifyCode === code;
		const isCodeNotExpired = user.verifyCodeExpiry > new Date();

		if (!isVerified) {
			return Response.json(
				{
					success: false,
					message: "Incorrect verification code",
				},
				{ status: 400 }
			);
		} else if (isVerified && isCodeNotExpired) {
			user.isVerified = true;
			await user.save();

			return Response.json(
				{
					success: true,
					message: "Account verified successfully",
				},
				{ status: 200 }
			);
		}

		return Response.json(
			{
				success: false,
				message: "Code expired, Signup again to get a new code",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return Response.json(
			{
				success: false,
				message: "Error verifying user",
			},
			{ status: 500 }
		);
	}
}
