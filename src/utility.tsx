import { NextRequest, NextResponse } from "next/server";

const isNumericInput = (event: any): Boolean => {
	return event.key >= 0 && event.key <= 9;
};

const isModifierKey = (event: any): Boolean => {
	const { key } = event;
	return (
		event.shiftKey ||
		key === "Shift" ||
		key === "Home" ||
		key === "End" ||
		key === "Backspace" ||
		key === "Tab" ||
		key === "Enter" ||
		key === "ArrowLeft" ||
		key === "ArrowUp" ||
		key === "ArrowRight" ||
		key === "ArrowDown" ||
		// Allow Ctrl/Command + A,C,V,X,Z
		((event.ctrlKey === true || event.metaKey === true) &&
			(key === "a" || key === "c" || key === "v" || key === "x" || key === "z"))
	);
};

const enforceFormat = (event: any, maxLength: number) => {
	if (maxLength && event.target.value.length >= maxLength) {
		return;
	}
	if (!isNumericInput(event) && !isModifierKey(event)) {
		event.preventDefault();
	}
};

const removeSpaces = (text: string): string => {
	return text.replace(/\D/g, "");
};

const headers = (req: NextRequest, accessToken: string): HeadersInit => {
	const contentType = req.headers.get("Content-Type")?.includes(";")
		? req.headers.get("Content-Type")?.split(";")[0]
		: req.headers.get("Content-Type");
	console.log(req.headers.get("Content-Type"));
	switch (contentType) {
		case "multipart/form-data":
			return { Authorization: accessToken ? `bearer ${accessToken}` : "" };
		default:
			return {
				"Content-Type": "application/json",
				Authorization: accessToken ? `bearer ${accessToken}` : "",
			};
	}
};

const GET_TOKEN = (cookie: string) => cookie.split(";")[0].split("=")[1];

const tokenRefresh = async (token: string | undefined) => {
	return await fetch("http://localhost:4000/token/refresh", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ token: token }),
		credentials: "include",
	});
};

const REQUEST = {
	get: async (url: string, req: NextRequest) => {
		const accessToken = req.cookies.get("accessToken")
			? req.cookies.get("accessToken")
			: await (
					await fetch("http://localhost:4000/token/refresh", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ token: req.cookies.get("refreshToken")?.value }),
						credentials: "include",
					})
			  ).json();
		return await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: accessToken ? `bearer ${accessToken.value}` : "",
			},
			credentials: "include",
		});
	},
	post: async (url: string, req: NextRequest, body?: any) => {
		let accessToken: any = req.cookies.get("accessToken")?.value;
		let refreshResponse: any = null;

		if (!accessToken) {
			refreshResponse = await tokenRefresh(req.cookies.get("refreshToken")?.value);
			if (refreshResponse.status !== 200) return refreshResponse;
			accessToken = GET_TOKEN(refreshResponse.headers.getSetCookie()[0]);
		}

		const apiResponse = await fetch(url, {
			method: "POST",
			headers: headers(req, accessToken),
			body: body,
			credentials: "include",
		});
		const res = await apiResponse.json();
		const newResponse = NextResponse.json(res);
		refreshResponse &&
			newResponse.headers.set("Set-Cookie", refreshResponse.headers.getSetCookie());
		return newResponse;
	},
};

export { REQUEST, isNumericInput, headers, isModifierKey, enforceFormat, removeSpaces };
