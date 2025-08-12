import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface User {
		id: string;
		isVerified?: boolean;
		username?: string;
		isAcceptingMessages?: boolean;
	}
	interface Session {
		user: {
			id: string;
			isVerified?: boolean;
			username?: string;
			isAcceptingMessages?: boolean;
		} & DefaultSession["user"];
	}
}
declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		isVerified?: boolean;
		username?: string;
		isAcceptingMessages?: boolean;
	}
}
