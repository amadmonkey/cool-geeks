import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const outRoutes = ["/login", "/register"];

export async function middleware(req: NextRequest) {
	const { origin, pathname } = req.nextUrl;
	const userToken = req.cookies.get("user");

	// if not logged in should not be able to enter protected routes
	if (userToken) {
		// if logged in
		const { admin } = JSON.parse(userToken.value);
		if (!admin && pathname.includes("admin"))
			return NextResponse.redirect(new URL("/", origin).toString());
		if (admin && !pathname.includes("admin"))
			return NextResponse.redirect(new URL("/admin", origin).toString());
	} else {
		// not logged in
		// console.log(req.nextUrl);
		if (!outRoutes.includes(pathname))
			return NextResponse.redirect(new URL("/login", origin).toString());
	}
}

export const config = {
	matcher: ["/admin", "/"],
};
