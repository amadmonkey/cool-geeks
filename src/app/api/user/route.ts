import { NextRequest, NextResponse } from "next/server";
import { REQUEST } from "@/utility";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		return await REQUEST.get(`${process.env.NEXT_PUBLIC_API}/user?${searchParams.toString()}`, req);
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}

export async function POST(req: NextRequest) {
	const body = await req.json();

	const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/user/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(body),
	});

	const data = await apiResponse.json();
	const newResponse = NextResponse.json(data);
	newResponse.headers.set("Set-Cookie", apiResponse.headers.getSetCookie().toString());
	return newResponse;
}

export async function DELETE(req: NextRequest) {
	const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/user/logout`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});
	const data = await apiResponse.json();
	const newResponse = NextResponse.json(data);

	req.cookies.delete("user");
	req.cookies.delete("accessToken");
	req.cookies.delete("refreshToken");
	return newResponse;
}
