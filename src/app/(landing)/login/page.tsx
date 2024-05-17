"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import Image from "next/image";
import Button from "../../ui/components/button/button";
import TextInput from "../../ui/components/text-input/text-input";
import FormGroup from "../../ui/components/form-group/form-group";
import TSParticles from "@/app/ui/components/particles/particles";

const LoginForm = () => {
	const { push } = useRouter();
	const [error, setError] = useState("");
	const [form, setForm] = useState({
		emailAccountNo: "admin",
		password: "wootwoot",
	});

	const updateForm = (e: any) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const login = async (e: any) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/user", {
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
		}
	};

	return (
		<section
			className="login-container"
			style={{
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				paddingTop: "200px",
			}}
		>
			<Image
				src={`/geek-head.png`}
				height={0}
				width={0}
				sizes="100vw"
				style={{ height: "100px", width: "auto", marginBottom: "10px", zIndex: 0 }}
				alt="Picture of the author"
			/>
			<Image
				src={`/geek-text.png`}
				height={0}
				width={0}
				sizes="100vw"
				style={{ height: "40px", width: "auto", zIndex: 0 }}
				alt="Picture of the author"
			/>
			<h1
				style={{
					marginBottom: "50px",
					fontSize: "12px",
					fontWeight: "800",
					letterSpacing: "13px",
					right: "-5px",
					position: "relative",
					color: "black",
				}}
			>
				PAYMENT&nbsp;&nbsp;TRACKER
			</h1>
			<form
				onSubmit={login}
				style={{ display: "flex", flexDirection: "column", gap: 20, width: "300px" }}
			>
				<FormGroup label="Email or Account Number">
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
				<p className="error-message" style={{ textAlign: "center" }}>
					{error}
				</p>
				<FormGroup>
					<Button type="submit" className="info">
						LOGIN
					</Button>
				</FormGroup>
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
