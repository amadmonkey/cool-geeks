import { NextRequest, NextResponse } from "next/server";
import { REQUEST } from "@/utility";

export async function GET(req: NextRequest) {
	try {
		const apiResponse = await REQUEST.get("http://localhost:4000/payment", req);
		return Response.json(await apiResponse.json());
	} catch (error: any) {
		return Response.json({ message: error });
	}
}

export async function POST(req: NextRequest) {
	const body = await req.json();

	const apiResponse = await fetch("http://localhost:4000/user/login", {
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
