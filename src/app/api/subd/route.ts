import { NextRequest } from "next/server";
import { REQUEST } from "@/utility";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const action = searchParams.get("action");

		if (action === "/image") {
			return await fetch(`${process.env.NEXT_PUBLIC_API}/subd/image?${searchParams.toString()}`, {
				method: "GET",
				headers: {},
				credentials: "include",
			});
		} else {
			return await REQUEST.get(
				`${process.env.NEXT_PUBLIC_API}/subd?${searchParams.toString()}`,
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
		console.log("2");
		const formData = await req.formData();
		return await REQUEST.post(`${process.env.NEXT_PUBLIC_API}/subd/create`, req, formData);
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}

// for subd form details
export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();
		try {
			return await REQUEST.put(
				`${process.env.NEXT_PUBLIC_API}/subd/update`,
				req,
				JSON.stringify(body)
			);
		} catch (error: any) {
			console.log(error);
			return Response.json({ message: error });
		}
	} catch (error: any) {
		console.log(error);
		return Response.json({ message: error });
	}
}

// for subd qr
export async function PATCH(req: NextRequest) {
	try {
		const formData = await req.formData();
		return await REQUEST.patch(`${process.env.NEXT_PUBLIC_API}/subd/update`, req, formData);
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
