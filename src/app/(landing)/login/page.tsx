"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { ACCOUNT_STATUS } from "@/utility";
import Image from "next/image";

import Button from "../../ui/components/button/button";
import TextInput from "../../ui/components/text-input/text-input";
import FormGroup from "../../ui/components/form-group/form-group";
import TSParticles from "@/app/ui/components/particles/particles";

import IconLoading from "../../../../public/loading.svg";

import "./page.scss";

const LoginForm = () => {
	const { push } = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [accountStatus, setAccountStatus] = useState<any>(null);
	const [form, setForm] = useState({
		emailAccountNo: "PES-2024-0007",
		password: "",
		confirmPassword: "",
	});

	const updateForm = (e: any) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: name === "emailAccountNo" ? value.toUpperCase() : value,
		}));
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		setError(null);
		setAccountStatus(ACCOUNT_STATUS.CUSTOM.LOADING);
		if (form.confirmPassword) {
			console.log("verify");
			verify();
		} else if (form.password) {
			console.log("login");
			login();
		} else {
			console.log("getAccountStatus");
			getAccountStatus();
		}
	};

	const login = async () => {
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
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_MID}/api/auth?${new URLSearchParams({
					filter: JSON.stringify({ input: form.emailAccountNo }),
				})}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const { code, data } = await res.json();
			console.log(data);
			switch (code) {
				case 200:
					switch (data.status) {
						case ACCOUNT_STATUS.CUSTOM.VERIFY:
							verify();
							break;
						default:
							break;
					}
					setAccountStatus(data.status);
					if (!data.status) setError("User does not exist");
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

	const verify = async () => {
		console.log(form);
		try {
			const { code, data } = await fetch("/api/auth", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					endpoint: "verify-email",
					form: form,
				}),
			}).then((res) => res.json());
			switch (code) {
				case 200:
					setAccountStatus(ACCOUNT_STATUS.CUSTOM.VERIFY);
					break;
				default:
					setError(data.general);
					break;
			}
		} catch (e) {
			console.log("verify catch", e);
			setError("Server error. Please try again later or contact [number here].");
		}
	};

	// const activate = async () => {
	// 	try {
	// 		const { code, data } = await fetch("/api/auth", {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			credentials: "include",
	// 			body: JSON.stringify({
	// 				endpoint: "activate",
	// 				form: { ...form, status: ACCOUNT_STATUS.STANDARD },
	// 			}),
	// 		}).then((res) => res.json());
	// 		switch (code) {
	// 			case 200:
	// 				// login(true);
	// 				setAccountStatus(ACCOUNT_STATUS.CUSTOM.VERIFY);
	// 				break;
	// 			default:
	// 				setError(data.general);
	// 				break;
	// 		}
	// 	} catch (e) {
	// 		console.log("verify catch", e);
	// 		setError("Server error. Please try again later or contact [number here].");
	// 	}
	// };

	const getTemplate = (status: string | null) => {
		const changeAccountBtn = (
			<button
				className="link"
				onClick={() => {
					setForm((prev) => ({
						...prev,
						...{
							password: "",
							confirmPassword: "",
						},
					}));
					setAccountStatus(null);
				}}
			>
				CHANGE ACCOUNT
			</button>
		);
		switch (status) {
			case ACCOUNT_STATUS.STANDARD:
				return (
					<>
						<FormGroup label="Password">
							<TextInput
								type="password"
								name="password"
								minLength="8"
								value={form.password}
								onChange={updateForm}
								autoFocus
								required
							/>
						</FormGroup>
						<FormGroup>
							<Button type="submit" className="info">
								LOGIN
							</Button>
						</FormGroup>
						{changeAccountBtn}
					</>
				);
			case ACCOUNT_STATUS.PENDING:
				return (
					<>
						<p className="instructions">
							You`re almost there! Enter a password below to finalize your account.
						</p>
						<FormGroup label="Password">
							<TextInput
								type="password"
								name="password"
								minLength="8"
								value={form.password}
								onChange={updateForm}
								autoFocus
								required
							/>
						</FormGroup>
						<FormGroup label="Confirm Password">
							<TextInput
								type="password"
								name="confirmPassword"
								minLength="8"
								value={form.confirmPassword}
								otherPassword={form.password}
								onChange={updateForm}
								required
							/>
						</FormGroup>
						<FormGroup>
							<Button type="submit" className="info">
								CONTINUE
							</Button>
						</FormGroup>
						{changeAccountBtn}
					</>
				);
			case ACCOUNT_STATUS.DEACTIVATED:
				return (
					<>
						<div className="deactivated-container">
							Account Deactivated. Please call or text [number here] or email us at [email here] for
							info
						</div>
						{changeAccountBtn}
					</>
				);
			case ACCOUNT_STATUS.CUSTOM.VERIFY:
				return (
					<p className="instructions">
						Email verification sent. Please check your email inbox for the link.
					</p>
				);
			case ACCOUNT_STATUS.CUSTOM.LOADING:
				return (
					<div style={{ display: "flex", justifyContent: "center" }}>
						<IconLoading style={{ height: "auto", width: "100px" }} />
					</div>
				);
			default:
				return (
					<FormGroup>
						<Button type="submit" className="info">
							CONTINUE
						</Button>
					</FormGroup>
				);
		}
	};

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
			<form onSubmit={handleSubmit}>
				<FormGroup label={accountStatus ? "Logging in as" : "Account Number or Email"}>
					{!accountStatus ? (
						<TextInput
							type="text"
							name="emailAccountNo"
							value={form.emailAccountNo}
							onChange={updateForm}
							autoFocus={true}
							required
						/>
					) : (
						<span style={{ fontSize: "16px", fontWeight: 800 }}>{form.emailAccountNo}</span>
					)}
				</FormGroup>
				{error && (
					<p className="error-message" style={{ textAlign: "center" }}>
						{error}
					</p>
				)}
				{getTemplate(accountStatus)}
				{/* <pre>{JSON.stringify(form, undefined, 2)}</pre> */}
			</form>
		</section>
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
