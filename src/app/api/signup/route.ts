import connectMongoDb from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(request: Request) {
	await connectMongoDb();
	try {
		const { username, email, password } = await request.json();
		if (!username || !email || !password) {
			return Response.json(
				{
					success: false,
					message: "All fields are required",
				},
				{ status: 400 }
			);
		}

		const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
		const verifyCodeExpiry = new Date();
		verifyCodeExpiry.setHours(verifyCodeExpiry.getMinutes() + 10);

		const user = await UserModel.findOne({ email, username });
		if (user) {
			// User already Exist
			if (user.isVerified) {
				return NextResponse.redirect(new URL("/login", request.url));
            }
            const hashedPassword = await hash(password, 10);
			await user.updateOne({
				$set: {
					username,
					email,
					password: hashedPassword,
					verifyCode,
					verifyCodeExpiry,
				},
				$currentDate: { updatedAt: true },
			});
		} else {
			const hashedPassword = await hash(password, 10);

			await UserModel.create({
				username,
				email,
				password: hashedPassword,
				verifyCode,
				verifyCodeExpiry,
				messages: [],
			});
		}

		const result = await sendVerificationEmail(email, verifyCode);

		if (!result.success) {
			// email sending failed
			return Response.json(
				{ success: false, message: result.message },
				{ status: 500 }
			);
		}

		return Response.json(
			{ success: true, message: result.message },
			{ status: 500 }
		);
	} catch (error) {
		console.error("Error registering usre:", error);
		return Response.json(
			{
				success: false,
				message: "Error registering user",
			},
			{
				status: 500,
			}
		);
	}
}
