import { NextRequest } from "next/server";
import { REQUEST } from "@/utility";

export async function POST(req: NextRequest) {
	const body = await req.json();
	try {
		return await REQUEST.post(
			`${process.env.NEXT_PUBLIC_API}/user/create`,
			req,
			JSON.stringify(body)
		);
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}
