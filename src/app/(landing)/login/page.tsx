"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import Image from "next/image";
import { ACCOUNT_STATUS } from "@/utility";

import Button from "../../ui/components/button/button";
import TextInput from "../../ui/components/text-input/text-input";
import FormGroup from "../../ui/components/form-group/form-group";
import TSParticles from "@/app/ui/components/particles/particles";

import IconLoading from "../../../../public/loading.svg";

import "./page.scss";

const LoginForm = () => {
	const { push } = useRouter();
	const [error, setError] = useState("");
	const [accountStatus, setAccountStatus] = useState<any>(null);
	const [form, setForm] = useState({
		emailAccountNo: "",
		password: "",
	});

	const updateForm = (e: any) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const login = async (e: any) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/auth", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(form),
			});
			const { code, data } = await res.json();
			switch (code) {
				case 200:
					setCookie("user", data.user);
					if (!data.user.admin) {
						setCookie("subd", data.subd);
						setCookie("plan", data.plan);
					}
					push(data.user.admin ? "/admin" : "/");
					break;
				case 400:
					setError(data.general);
					break;
				case 403:
					setError(data.general);
					break;
				default:
					setError(data.general);
					break;
			}
		} catch (e) {
			console.log("login catch", e);
			setError("Server error. Please try again later or contact [number here].");
		}
	};

	const getAccountStatus = async () => {
		const searchOptions = new URLSearchParams({
			filter: JSON.stringify({
				$or: [{ accountNumber: form.emailAccountNo }, { email: form.emailAccountNo }],
			}),
			page: "1",
			limit: "10",
			sort: JSON.stringify({
				name: "asc",
				code: "asc",
			}),
		});
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_MID}/api/user?${searchOptions}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				// credentials: "include",
			});
			const { code, data } = await res.json();
			console.log(data);
			switch (code) {
				case 200:
					// setCookie("user", data.user);
					// if (!data.user.admin) {
					// 	setCookie("subd", data.subd);
					// 	setCookie("plan", data.plan);
					// }
					// push(data.user.admin ? "/admin" : "/");
					break;
				case 400:
					setError(data.general);
					break;
				case 403:
					setError(data.general);
					break;
				default:
					setError(data.general);
					break;
			}
		} catch (e) {
			console.log("login catch", e);
			setError("Server error. Please try again later or contact [number here].");
		}
	};

	useEffect(() => {
		if (form.emailAccountNo) {
			setAccountStatus("LOADING");
			// getAccountStatus();
		} else {
			setAccountStatus(null);
		}
	}, [form]);

	return (
		<section className="login-container">
			<Image
				src={`/geek-head.png`}
				height={0}
				width={0}
				sizes="100vw"
				alt="Logo head"
				className="login-container__head"
			/>
			<Image
				src={`/geek-text.png`}
				height={0}
				width={0}
				sizes="100vw"
				alt="Logo text"
				className="login-container__text"
			/>
			<h1>RECEIPT&nbsp;&nbsp;TRACKER</h1>
			<form
				onSubmit={login}
				style={{ display: "flex", flexDirection: "column", gap: 20, width: "300px" }}
			>
				<FormGroup>
					<TextInput
						type="text"
						name="emailAccountNo"
						value={form.emailAccountNo}
						onChange={updateForm}
						required
					/>
				</FormGroup>
				<FormGroup label="Password">
					<TextInput
						type="password"
						name="password"
						value={form.password}
						minLength="8"
						onChange={updateForm}
						required
					/>
				</FormGroup>
				{error && (
					<p className="error-message" style={{ textAlign: "center" }}>
						{error}
					</p>
				)}
				<FormGroup>
					<Button type="submit" className="info">
						LOGIN
					</Button>
				</FormGroup>
				{/* {getTemplate(accountStatus)} */}

				{/* <pre>{JSON.stringify(form, undefined, 2)}</pre> */}
			</form>
		</section>
	);
};

const getTemplate = (status: string | null) => {
	switch (status) {
		case ACCOUNT_STATUS.ACTIVE:
			return <TemplateActive />;
		case ACCOUNT_STATUS.DEACTIVATED:
			return <TemplateDeactivated />;
		case ACCOUNT_STATUS.PENDING:
			return <TemplatePending />;
		case "LOADING":
			return <TemplateLoading />;
		default:
			return <p className="status-description">Enter email or account number</p>;
	}
};

const TemplateActive = () => {
	return <div>TemplateActive</div>;
};

const TemplateDeactivated = () => {
	return <div>TemplateDeactivated</div>;
};

const TemplatePending = () => {
	return <div>TemplatePending</div>;
};
const TemplateLoading = () => {
	return (
		<div style={{ display: "flex", justifyContent: "center" }}>
			<IconLoading style={{ height: "auto", width: "100px" }} />
		</div>
	);
};

const Particles = () => {
	return <TSParticles />;
};

export default function Login() {
	return (
		<>
			<Particles />
			<LoginForm />
		</>
	);
}
