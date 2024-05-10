import { NextRequest } from "next/server";
import { REQUEST } from "@/utility";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		return await REQUEST.get(
			`${process.env.NEXT_PUBLIC_API}/${searchParams.get("type")}/${searchParams.get("filename")}`,
			req
		);
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}
