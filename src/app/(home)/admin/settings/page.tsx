"use client";

import { useState } from "react";
import { PRE } from "@/utility";

export default function Settings() {
	const [test, setTest] = useState<any>(null);
	return (
		<>
			<button
				onClick={async () => {
					const { code, data } = await fetch(`/auth/email-test`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
					}).then((res) => res.json());
					console.log(code);
					console.log(data);
					setTest(data);
				}}
			>
				test
			</button>
			{PRE(test)}
		</>
	);
}
