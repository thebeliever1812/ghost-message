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
		const result = UsernameQuerySchema.safeParse({ queryParam });
		console.log(result);
		if (!result.success) {
			return Response.json(
				{
					success: result.success,
					message: result.error.issues[0].message,
				},
				{ status: 400 }
			);
		}

		const {username} = result.data
		return Response.json(
			{
				sucess: true,
				message: "Valid username",
			},
			{ status: 200 }
		);
	} catch (error) {
		return Response.json(
			{
				success: false,
				message: "Error getting username",
			},
			{ status: 500 }
		);
	}
}
