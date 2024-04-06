import { NextRequest, NextResponse } from "next/server";
import { REQUEST } from "../../../utility";

export async function GET(req: NextRequest) {
	try {
		return await REQUEST.post("http://localhost:4000/payment", req);
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		return await REQUEST.post("http://localhost:4000/payment/create", req, formData);
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}
