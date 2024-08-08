import { NextRequest, NextResponse } from "next/server";
import { REQUEST } from "../../../utility";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const action = searchParams.get("action");

		if (action === "/image") {
			return await fetch(
				`${process.env.NEXT_PUBLIC_API}/receipt/image?${searchParams.toString()}`,
				{
					method: "GET",
					headers: {},
					credentials: "include",
				}
			);
		} else {
			return await REQUEST.get(
				`${process.env.NEXT_PUBLIC_API}/receipt${action || ""}?${searchParams.toString()}`,
				req
			);
		}
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		return await REQUEST.post(
			`${process.env.NEXT_PUBLIC_API}/receipt/${formData.get("action") || "create"}`,
			req,
			formData
		);
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}

export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();
		return await REQUEST.put(
			`${process.env.NEXT_PUBLIC_API}/receipt/update`,
			req,
			JSON.stringify(body)
		);
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}
