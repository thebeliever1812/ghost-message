import connectMongoDb from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";

const UsernameQuerySchema = z.object({
	username: usernameValidation,
});

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const queryParam = searchParams.get("username");
		// Validate with zod
		const result = UsernameQuerySchema.safeParse({ username: queryParam });
		if (!result.success) {
			return Response.json(
				{
					success: result.success,
					message: result.error.issues[0].message,
				},
				{ status: 400 }
			);
		}

		const { username } = result.data;

		await connectMongoDb();

		const existingUser = await UserModel.findOne({
			username,
			isVerified: true,
		});

		if (existingUser) {
			return Response.json(
				{
					success: false,
					message: "Username not available",
				},
				{ status: 300 }
			);
		}

		return Response.json(
			{
				success: true,
				message: "Username available",
			},
			{ status: 200 }
		);
	} catch {
		return Response.json(
			{
				success: false,
				message: "Error getting username",
			},
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const { username } = await request.json();

		const result = UsernameQuerySchema.safeParse({ username });
		if (!result.success) {
			return Response.json(
				{
					success: false,
					message: result.error.issues[0].message,
				},
				{ status: 400 }
			);
		}

		const { username: usernameAfterValidation } = result.data;

		await connectMongoDb();

		const user = await UserModel.findOne({ username: usernameAfterValidation });

		if (!user) {
			return Response.json(
				{
					success: false,
					message: "User not found with this username",
				},
				{ status: 404 }
			);
		}

		return Response.json(
			{
				success: true,
				message: "User found",
			},
			{ status: 201 }
		);
	} catch {
		return Response.json(
			{
				success: false,
				message: "Something went wrong, try again",
			},
			{ status: 500 }
		);
	}
}
