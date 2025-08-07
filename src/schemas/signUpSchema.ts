import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(5, { message: "Username must be 5-20 characters long" })
	.max(20, { message: "Username must be 3-20 characters long" })
	.regex(/^[a-zA-Z0-9_]+$/, {
		message:
			"Username must contain only letters, numbers, and underscores with no space",
	});

export const signUpSchema = z.object({
	username: usernameValidation,
	email: z.email({ message: "Enter a valid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be atleast 6 characters long" }),
});
