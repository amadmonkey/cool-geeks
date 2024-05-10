import { NextRequest } from "next/server";
import { REQUEST } from "@/utility";

export async function POST(req: NextRequest) {
	const body = await req.json();
	console.log(body);

	// const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/user/create`, {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	credentials: "include",
	// 	body: JSON.stringify(body),
	// });

	return await REQUEST.post(
		`${process.env.NEXT_PUBLIC_API}/user/create`,
		req,
		JSON.stringify(body)
	);
}
