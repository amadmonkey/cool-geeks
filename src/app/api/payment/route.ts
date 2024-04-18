import { NextRequest, NextResponse } from "next/server";
import { REQUEST } from "../../../utility";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		return await REQUEST.get(`http://localhost:4000/payment?${searchParams.toString()}`, req);
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

export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();
		return await REQUEST.post("http://localhost:4000/payment/update", req, JSON.stringify(body));
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}
