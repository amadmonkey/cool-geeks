import { NextRequest } from "next/server";
import { REQUEST } from "@/utility";

export async function GET(req: NextRequest) {
	try {
		console.log(`${process.env.NEXT_PUBLIC_API}/user/dashboard-info`);
		return await REQUEST.get(`${process.env.NEXT_PUBLIC_API}/user/dashboard-info`, req);
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}
