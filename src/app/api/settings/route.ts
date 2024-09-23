import { NextRequest } from "next/server";
import { REQUEST } from "../../../utility";

export async function GET(req: NextRequest) {
	try {
		return await REQUEST.get(`${process.env.NEXT_PUBLIC_API}/settings`, req);
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}
