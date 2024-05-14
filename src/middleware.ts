import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { REFRESH_TOKEN } from "./utility";

const outRoutes = ["/login", "/register"];

export function middleware(req: NextRequest) {
	const { origin, pathname } = req.nextUrl;
	const userToken = req.cookies.get("user");
	const accessToken = req.cookies.get("accessToken");

	console.log("MIDDLEWARE: userToken", userToken);
	console.log("MIDDLEWARE: accessToken", accessToken);

	// if not logged in should not be able to enter protected routes
	if (accessToken) {
		// if logged in
		const { admin } = JSON.parse(userToken!.value);
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
