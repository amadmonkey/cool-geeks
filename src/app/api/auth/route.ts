import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const apiResponse = await fetch(
			`${process.env.NEXT_PUBLIC_API}/auth?${searchParams.toString()}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			}
		);
		const data = await apiResponse.json();
		const newResponse = NextResponse.json(data);
		return newResponse;
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}

export async function POST(req: NextRequest) {
	const body = await req.json();

	console.log("process.env.NEXT_PUBLIC_API", process.env.NEXT_PUBLIC_API);
	console.log("body.url", body.url);
	const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/${body.url || "login"}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(body),
	});
	console.log("apiResponse", apiResponse);
	const data = await apiResponse.json();
	const newResponse = NextResponse.json(data);
	newResponse.headers.set("Set-Cookie", apiResponse.headers.getSetCookie().toString());
	return newResponse;
}

export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();
		const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/${body.endpoint}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body.form),
		});

		const data = await apiResponse.json();
		console.log(data);
		const newResponse = NextResponse.json(data);
		newResponse.headers.set("Set-Cookie", apiResponse.headers.getSetCookie().toString());
		return newResponse;
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}

export async function DELETE(req: NextRequest) {
	const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/logout`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});
	const data = await apiResponse.json();
	const newResponse = NextResponse.json(data);

	newResponse.cookies.delete("user");
	newResponse.cookies.delete("accessToken");
	newResponse.cookies.delete("refreshToken");

	return newResponse;
}
