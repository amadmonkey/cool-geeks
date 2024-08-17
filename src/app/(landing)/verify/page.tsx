"use client";
import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import { Id, toast } from "react-toastify";

const Verify = () => {
	return (
		<Suspense>
			<Content />
		</Suspense>
	);
};

const Content = () => {
	const { push } = useRouter();
	const toastActivateId = useRef<Id>("");
	const toastResetPassId = useRef<Id>("");
	const token = useSearchParams().get("t");
	const action = useSearchParams().get("a");
	const accountNumber = useSearchParams().get("u");

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
					if (!toast.isActive(toastActivateId.current)) {
						toastActivateId.current = toast.success(
							`Account activated. Welcome ${user.firstName}!`
						);
					}
					push("/");
					break;
				default:
					push(`/login?e=${data.message}`);
					break;
			}
		} catch (e) {
			console.log("verify catch", e);
		}
	};

	const resetPassword = async () => {
		try {
			const { code, data } = await fetch("/api/auth", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					endpoint: "reset-password",
					form: { accountNumber, token },
				}),
			}).then((res) => res.json());
			switch (code) {
				case 200:
					if (!toast.isActive(toastResetPassId.current)) {
						toastResetPassId.current = toast.success(`Password reset successful`);
					}
					push(`/login?u=${data.accountNumber}`);
					break;
				default:
					push(`/login?e=${data.message}`);
					break;
			}
		} catch (e) {
			console.log("verify catch", e);
		}
	};

	useEffect(() => {
		switch (action) {
			case "activate":
				activate();
				break;
			case "reset":
				resetPassword();
				break;
			default:
				// show 404 or redirect to login
				break;
		}
	}, []);

	return <></>;
};

export default Verify;
