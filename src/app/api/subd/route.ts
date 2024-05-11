import { NextRequest, NextResponse } from "next/server";
import { REQUEST } from "@/utility";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		return await REQUEST.get(`${process.env.NEXT_PUBLIC_API}/subd?${searchParams.toString()}`, req);
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		return await REQUEST.post(`${process.env.NEXT_PUBLIC_API}/subd/create`, req, formData);
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}

export async function PUT(req: NextRequest) {
	try {
		const formData = await req.formData();
		return await REQUEST.put(`${process.env.NEXT_PUBLIC_API}/subd/update`, req, formData);
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const body = await req.json();
		return await REQUEST.delete(
			`${process.env.NEXT_PUBLIC_API}/subd/delete`,
			req,
			JSON.stringify(body)
		);
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}
