// if (req.cookies.get("accessToken")) {
// 	console.log("middleware accessToken valid");
// 	return NextResponse.next();
// } else {
// try {
// 	console.log("middleware accessToken invalid. get new token");
// const apiResponse = await REQUEST.post("http://localhost:4000/token/refresh", req, {
// 	token: req.cookies.get("refreshToken")?.value,
// });
// console.log("apiResponse.url", apiResponse.url);
// const res = await apiResponse.json();
// const newResponse = NextResponse.next();
// switch (res.code) {
// 	case 200:
// 		console.log("refresh token successful", apiResponse.headers.getSetCookie().toString());
// 		newResponse.headers.set("Set-Cookie", apiResponse.headers.getSetCookie().toString());
// 		const accessToken = apiResponse.headers
// 			.getSetCookie()[0]
// 			.split(", ")[0]
// 			.split(";")[0]
// 			.split("=")[1];
// 		const refreshToken = apiResponse.headers
// 			.getSetCookie()[0]
// 			.split(", ")[2]
// 			.split(";")[0]
// 			.split("=")[1];
// 		newResponse.cookies.set("accessToken", accessToken, {
// 			httpOnly: true, // Cookie will not be exposed to client side code
// 			sameSite: "lax", // If client and server origins are different
// 			secure: false, // use with HTTPS only
// 			maxAge: 10,
// 		});
// 		newResponse.cookies.set("refreshToken", refreshToken, {
// 			httpOnly: true, // Cookie will not be exposed to client side code
// 			sameSite: "lax", // If client and server origins are different
// 			secure: false, // use with HTTPS only
// 			maxAge: 3600,
// 		});
// 		return newResponse;
// 	default:
// 		console.log("refresh token failed");
// 		return NextResponse.redirect(new URL("/login", req.url));
// }
// } catch (e) {
// 	console.log("middleware catch", e);
// 	return NextResponse.redirect(new URL("/login", req.url));
// }
// }
