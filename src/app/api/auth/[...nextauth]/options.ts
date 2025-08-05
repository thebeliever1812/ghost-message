import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectMongoDb from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials: any): Promise<any> {
				// Connect db
				await connectMongoDb();

				try {
					const user = await UserModel.findOne({
						$or: [
							{ email: credentials.identifier },
							{ username: credentials.identifier },
						],
					});

					if (!user) {
						throw new Error("User not found with this email");
					}

					if (!user.isVerified) {
						throw new Error("Please verify your account");
					}

					const isPasswordMatch = await bcrypt.compare(
						credentials.password,
						user.password
					);

					if (!isPasswordMatch) {
						throw new Error("Incorrect Password");
					}

					return user;
				} catch (error: any) {
					throw new Error(error);
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token._id = user._id;
				token.isVerified = user.isVerified;
				token.username = user.username;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user._id = token._id;
				session.user.isVerified = token.isVerified;
				session.user.username = token.username;
			}
			return session;
		},
	},
	pages: {
		signIn: "/sign-in",
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
