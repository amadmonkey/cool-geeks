"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import { toast } from "react-toastify";

const Verify = () => {
	const { push } = useRouter();
	const accountNumber = useSearchParams().get("u");
	const token = useSearchParams().get("t");

	const activate = async () => {
		try {
			const { code, data } = await fetch("/api/auth", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					endpoint: "activate",
					form: { accountNumber, token },
				}),
			}).then((res) => res.json());
			switch (code) {
				case 200:
					const { user, subd, plan } = data;
					setCookie("user", user);
					setCookie("subd", subd);
					setCookie("plan", plan);
					toast.success(`Account activated. Welcome ${user.firstName}!`);
					push("/");
					break;
				default:
					push("/");
					break;
			}
		} catch (e) {
			console.log("verify catch", e);
		}
	};

	useEffect(() => {
		console.log("========");
		activate();
	}, []);
};

export default Verify;
