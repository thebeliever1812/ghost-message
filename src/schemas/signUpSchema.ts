import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(3, "Username must be 3-20 characters long")
	.max(20, "Username must be 3-20 characters long")
	.regex(
		/^[a-zA-Z0-9_]$/,
		"Username must contain only letters, numbers, and underscores with no space"
	);

export const signUpSchema = z.object({
	username: usernameValidation,
	email: z.email("Enter a valid email address"),
	password: z.string().min(6, "Password must be atleast 6 characters long"),
});
