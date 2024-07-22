import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";

import IconAccepted from "../public/done.svg";
import IconDenied from "../public/denied.svg";
import IconPending from "../public/pending.svg";

const CUTOFF_TYPE = {
	MID: "MID",
	END: "END",
};

const ACCOUNT_STATUS = {
	STANDARD: "STANDARD", // can login
	PENDING: "PENDING", // cannot login, ask for password
	DEACTIVATED: "DEACTIVATED", // cannot login
	VERIFY: "VERIFY",
};

const UI_TYPE = {
	info: "info",
	danger: "danger",
	success: "success",
};

const RECEIPT_STATUS = {
	FAILED: "FAILED",
	DENIED: "DENIED",
	PENDING: "PENDING",
	ACCEPTED: "ACCEPTED",
};

const REGEX = {
	PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{9,}$/,
};

const IS_NUMERIC_INPUT = (event: any): Boolean => {
	return event.key >= 0 && event.key <= 9;
};

const IS_MODIFIER_KEY = (event: any): Boolean => {
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

const ENHANCE_FORMAT = (event: any, maxLength: number) => {
	if (maxLength && event.target.value.length >= maxLength) {
		return;
	}
	if (!IS_NUMERIC_INPUT(event) && !IS_MODIFIER_KEY(event)) {
		event.preventDefault();
	}
};

const REMOVE_SPACES = (text: string): string => text.replace(/\D/g, "");

const HEADERS = (req: NextRequest, accessToken: string): HeadersInit => {
	const contentType = req.headers.get("Content-Type")?.includes(";")
		? req.headers.get("Content-Type")?.split(";")[0]
		: req.headers.get("Content-Type");
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

const RECEIPT_STATUS_BADGE = (status: any) => {
	switch (status) {
		case RECEIPT_STATUS.ACCEPTED:
			return <div className="badge badge__accepted">ACCEPTED</div>;
		case RECEIPT_STATUS.PENDING:
			return <div className="badge">PENDING</div>;
		case RECEIPT_STATUS.FAILED:
			return <div className="badge badge__denied">FAILED</div>;
		default:
			return <div className="badge badge__denied">DENIED</div>;
	}
};

const RECEIPT_STATUS_ICON = (status: any, styles: any) => {
	let test = {
		height: "20px",
		width: "auto",
		marginRight: "10px",
	};
	if (styles) test = { ...test, ...styles };
	switch (status?.toUpperCase()) {
		case RECEIPT_STATUS.PENDING:
			return <IconPending style={{ ...test, ...{ fill: "#b6b6b6" } }} height="20" />;
		case RECEIPT_STATUS.ACCEPTED:
			return <IconAccepted style={{ ...test }} className="success" />;
		case RECEIPT_STATUS.DENIED:
			return <IconDenied style={test} className="danger" />;
		default:
			return (
				<div className="skeleton" style={test}>
					&nbsp;
				</div>
			);
	}
};

const PARSE_TOKEN = (cookie: string) => cookie.split(";")[0].split("=")[1];

const tokenRefresh = async (token: string | undefined) => {
	return await fetch(`${process.env.NEXT_PUBLIC_API}/token/refresh`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ token: token }),
		credentials: "include",
	});
};

const REFRESH_TOKEN = async (req: NextRequest) => {
	let accessToken: any = req.cookies.get("accessToken")?.value;
	let refreshResponse: any = null;
	if (!accessToken) {
		refreshResponse = await tokenRefresh(req.cookies.get("refreshToken")?.value);
		// console.log("=========", refreshResponse);
		if (refreshResponse.status !== 200) return { refreshResponse: refreshResponse };
		accessToken = PARSE_TOKEN(refreshResponse.headers.getSetCookie()[0]);
	}
	return {
		accessToken,
		refreshResponse,
	};
};

const newResponse = async (res: any, refreshResponse: any) => {
	const newResponse = NextResponse.json(res);
	refreshResponse && newResponse.headers.set("Set-Cookie", refreshResponse.headers.getSetCookie());
	return newResponse;
};

const REQUEST = {
	get: async (url: string, req: NextRequest) => {
		try {
			const { accessToken, refreshResponse } = await REFRESH_TOKEN(req);
			// console.log("accessToken", accessToken);
			// console.log("refreshResponse", refreshResponse);
			if (!accessToken) {
				const newResponse = NextResponse.json(NextResponse.json(refreshResponse));
				("");
				console.log("newResponse", newResponse);
				newResponse.cookies.delete("user");
				newResponse.cookies.delete("accessToken");
				newResponse.cookies.delete("refreshToken");
				return newResponse;
			}
			const apiResponse = await fetch(url, {
				method: "GET",
				headers: HEADERS(req, accessToken),
				credentials: "include",
			}).then((res) => res.json());
			return newResponse(apiResponse, refreshResponse);
		} catch (e) {
			return NextResponse.json(NextResponse.json(e));
		}
	},
	post: async (url: string, req: NextRequest, body?: any) => {
		try {
			const { accessToken, refreshResponse } = await REFRESH_TOKEN(req);
			const apiResponse = await fetch(url, {
				method: "POST",
				headers: HEADERS(req, accessToken),
				body: body,
				credentials: "include",
			}).then((res) => res.json());
			console.log("POST:", apiResponse);
			return newResponse(apiResponse, refreshResponse);
		} catch (e) {
			return NextResponse.json(NextResponse.json(e));
		}
	},
	put: async (url: string, req: NextRequest, body?: any) => {
		try {
			const { accessToken, refreshResponse } = await REFRESH_TOKEN(req);
			const apiResponse = await fetch(url, {
				method: "PUT",
				headers: HEADERS(req, accessToken),
				body: body,
				credentials: "include",
			}).then((res) => res.json());
			console.log("PUT:", apiResponse);
			return newResponse(apiResponse, refreshResponse);
		} catch (e) {
			return NextResponse.json(NextResponse.json(e));
		}
	},
	delete: async (url: string, req: NextRequest, body?: any) => {
		try {
			const { accessToken, refreshResponse } = await REFRESH_TOKEN(req);
			const apiResponse = await fetch(url, {
				method: "DELETE",
				headers: HEADERS(req, accessToken),
				body: body,
				credentials: "include",
			}).then((res) => res.json());
			console.log("DELETE", apiResponse);
			return newResponse(apiResponse, refreshResponse);
		} catch (e) {
			return NextResponse.json(NextResponse.json(e));
		}
	},
};

const SKELETON_TYPES = {
	SUBD: "subd",
	PLAN: "plan",
	RECEIPTS: "receipts",
	ACCOUNTS: "accounts",
	RECEIPT_FORM: "receipt-form",
	RECEIPT_CARD: "receipt-card",
	HISTORY_TABLE: "history-table",
};

const VIEW_MODES = {
	GRID: "GRID",
	LIST: "LIST",
	CAROUSEL: "CAROUSEL",
};

const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const STRING_UTILS = {
	SPACE_TO_DASH: (name: string) => name.split(" ").join("-"),
	DASH_TO_SPACE: (name: string) => name.split("-").join(" "),
};

const TABLE_HEADERS = {
	receipts: {
		user: {},
		plan: {},
		cutoff_date: {},
		date_submitted: {},
		ref_number: {},
		receipt: {},
		status: {},
	},
	plans: {
		name: {},
		price: {},
		info: {},
	},
	plansCreate: {
		name: {},
		price: {},
		description: {},
	},
	accounts: {
		user: {
			sort: {
				by: ["firstName", "middleName", "lastName", "accountNumber"],
				order: "asc",
			},
		},
		address: {
			sort: {
				by: ["address"],
				order: "asc",
			},
		},
		contact: {
			sort: {
				by: ["contactNo", "email"],
				order: "asc",
			},
		},
		// email: {
		// 	sort: {
		// 		by: ["email"],
		// 		order: "asc",
		// 	},
		// },
		plan: {
			sort: {
				by: ["planRef.name"],
				order: "asc",
			},
		},
		subd: {
			sort: {
				by: ["subdRef.name"],
				order: "asc",
			},
		},
		created_at: {
			sort: {
				by: ["createdAt"],
				order: "desc",
			},
		},
		updated_at: {
			sort: {
				by: ["updatedAt"],
				order: "desc",
			},
		},
	},
};

const DEFAULT_VALUES = {
	planForm: {
		name: "",
		price: "",
		description: "",
	},
	subdForm: {
		name: "",
		code: "",
		number: "",
		plans: [],
		qr: "",
	},
};

const VALID_IMG_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/pdf"];

const DATE_READABLE = (dateString: any) => {
	if (!dateString) return <div className="skeleton" style={{ height: "100%" }}></div>;
	const date = new Date(dateString);
	return `${date.toLocaleString("default", {
		month: "long",
	})} ${date.getDate()}, ${date.getFullYear()}`;
};

const getDaysLeft = (d: DateTime) => {
	// const date = d ? DateTime.fromISO(d) : DateTime.now();
	// const dueInDate = cutoff === CUTOFF_TYPE.MID ? date.set({ day: 15 }) : date.endOf("month");

	Object.assign(d, d.set({ hour: 23, minute: 59, second: 59, millisecond: 999 }));

	return d.diff(DateTime.now(), ["days", "hours", "minute"]);

	// return `${diff.days} days and ${diff.hours} hours`;
};

export {
	REGEX,
	REQUEST,
	HEADERS,
	UI_TYPE,
	VIEW_MODES,
	CUTOFF_TYPE,
	MONTH_NAMES,
	STRING_UTILS,
	TABLE_HEADERS,
	REMOVE_SPACES,
	DATE_READABLE,
	REFRESH_TOKEN,
	ENHANCE_FORMAT,
	DEFAULT_VALUES,
	ACCOUNT_STATUS,
	RECEIPT_STATUS,
	SKELETON_TYPES,
	IS_MODIFIER_KEY,
	VALID_IMG_TYPES,
	IS_NUMERIC_INPUT,
	RECEIPT_STATUS_ICON,
	RECEIPT_STATUS_BADGE,
	getDaysLeft,
};
