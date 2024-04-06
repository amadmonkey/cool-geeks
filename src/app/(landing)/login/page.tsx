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
		emailAccountNo: "111",
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
					setCookie("subd", data.subd);
					setCookie("plan", data.plan);
					push("/");
					break;
				case 400:
					setError(data.general);
					break;
				default:
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
				style={{ height: "150px", width: "auto", marginBottom: "10px", zIndex: 0 }}
				alt="Picture of the author"
			/>
			<Image
				src={`/geek-text.png`}
				height={0}
				width={0}
				sizes="100vw"
				style={{ height: "50px", width: "auto", zIndex: 0 }}
				alt="Picture of the author"
			/>
			<h1
				style={{
					marginBottom: "50px",
					fontSize: "15px",
					fontWeight: "800",
					letterSpacing: "17px",
					right: "-8px",
					position: "relative",
					color: "black",
				}}
			>
				PAYMENT&nbsp;&nbsp;TRACKER
			</h1>
			<form
				onSubmit={login}
				style={{ display: "flex", flexDirection: "column", gap: 20, width: "400px" }}
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
					<Button type="submit">LOGIN</Button>
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
