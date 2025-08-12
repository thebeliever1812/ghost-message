import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectMongoDb from "@/lib/dbConnect";
import UserModel from "@/models/User";

interface MyUser {
	id: string; // Required by NextAuth
	_id: string;
	username: string;
	isVerified: boolean;
	isAcceptingMessages: boolean;
}

interface Credentials {
	identifier: string;
	password: string;
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				identifier: { label: "Email or Username", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(
				credentials: Credentials | undefined
			): Promise<MyUser | null> {
				if (!credentials?.identifier || !credentials?.password) {
					throw new Error("Missing credentials");
				}

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
						throw new Error("Email not verified Signup again");
					}

					const isPasswordMatch = await bcrypt.compare(
						credentials.password,
						user.password
					);

					if (!isPasswordMatch) {
						throw new Error("Incorrect Password");
					}

					return {
						id: String(user._id),
						_id: String(user._id), // keep for your own use
						username: user.username,
						isVerified: user.isVerified,
						isAcceptingMessages: user.isAcceptingMessage,
					};
				} catch (error) {
					if (error instanceof Error) {
						throw new Error(error.message);
					}
					throw new Error("An unexpected error occurred");
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token._id = user._id;
				token.username = user.username;
				token.isVerified = user.isVerified;
				token.isAcceptingMessages = user.isAcceptingMessages;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user._id = token._id;
				session.user.username = token.username;
				session.user.isVerified = token.isVerified;
				session.user.isAcceptingMessages = token.isAcceptingMessages;
			}
			return session;
		},
	},
	pages: {
		signIn: "/sign-in",
	},
	session: {
		strategy: "jwt",
		maxAge: 24 * 60 * 60,
	},
	secret: process.env.NEXTAUTH_SECRET,
};
