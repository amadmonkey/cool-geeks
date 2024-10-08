import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const outRoutes = ["/login", "/register", "/verify"];

export function middleware(req: NextRequest) {
	const { origin, pathname } = req.nextUrl;
	const user = req.cookies.get("user");
	// const accessToken = req.cookies.get("accessToken");

	// console.log("MIDDLEWARE: accessToken", accessToken);
	// console.log("MIDDLEWARE: refreshToken", req.cookies.get("refreshToken"));

	// if not logged in should not be able to enter protected routes

	if (user) {
		// if logged in
		const { admin } = JSON.parse(user!.value);
		if (!admin && pathname.includes("admin"))
			return NextResponse.redirect(new URL("/", origin).toString());
		if (admin && !pathname.includes("admin"))
			return NextResponse.redirect(new URL("/admin", origin).toString());
	} else {
		if (!outRoutes.includes(pathname))
			return NextResponse.redirect(new URL("/login", origin).toString());
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|.*\\..*|favicon.ico|/).*)",
	],
};
