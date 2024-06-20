import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const outRoutes = ["/login", "/register"];

export function middleware(req: NextRequest) {
	const { origin, pathname } = req.nextUrl;
	const user = req.cookies.get("user");
	const accessToken = req.cookies.get("accessToken");

	console.log("MIDDLEWARE: userToken", user);
	console.log("MIDDLEWARE: accessToken", accessToken);

	// if not logged in should not be able to enter protected routes
	if (user) {
		// TODO: delete cookie if no accesstoken
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
