import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	try {
		const token = await getToken({ req: request });
		const pathname = request.nextUrl.pathname;

		const authPages = ["/sign-in", "/sign-up"];

		const isAuthPage = authPages.includes(pathname);

		// Redirect unauthenticated user trying to access protected page
		if (
			!token &&
			(pathname.startsWith("/dashboard") || pathname.startsWith("/verify"))
		) {
			return NextResponse.redirect(new URL("/sign-in", request.url));
		}

		// Redirect authenticated user trying to access auth pages
		if (token && isAuthPage) {
			return NextResponse.redirect(new URL("/", request.url));
		}

		return NextResponse.next();
	} catch (error) {
		console.log("Error in middleware:", error);
		return NextResponse.next();
	}
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
