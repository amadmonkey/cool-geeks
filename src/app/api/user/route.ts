import { NextRequest } from "next/server";
import { REQUEST } from "@/utility";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		return await REQUEST.get(
			`${process.env.NEXT_PUBLIC_API}/user${
				searchParams.get("action") || ""
			}?${searchParams.toString()}`,
			req
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
			`${process.env.NEXT_PUBLIC_API}/user/update`,
			req,
			JSON.stringify(body)
		);
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}
