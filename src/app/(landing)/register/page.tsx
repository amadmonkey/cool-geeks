"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../ui/components/button/button";
import TextInput from "../../ui/components/text-input/text-input";
import FormGroup from "../../ui/components/form-group/form-group";

import "./page.scss";

export default function Register() {
	const { push } = useRouter();
	const [form, setForm] = useState({
		accountNumber: "",
		password: "",
		confirmPassword: "",
	});

	const updateForm = (e: any) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		push("/login");
	};

	return (
		<section style={{ paddingTop: "200px" }}>
			<form
				onSubmit={handleSubmit}
				style={{ display: "flex", flexDirection: "column", gap: 20, width: "400px" }}
			>
				<FormGroup label="Account Number">
					<TextInput
						type="text"
						name="accountNumber"
						value={form.accountNumber}
						minLength="9"
						maxLength="9"
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
						otherPassword={form.confirmPassword}
						onChange={updateForm}
						required
					/>
				</FormGroup>
				<FormGroup label="Confirm Password">
					<TextInput
						type="password"
						name="confirmPassword"
						value={form.confirmPassword}
						minLength="8"
						otherPassword={form.password}
						onChange={updateForm}
						required
					/>
				</FormGroup>
				<FormGroup>
					<Button type="submit">CREATE MY ACCOUNT</Button>
				</FormGroup>
				<pre>{JSON.stringify(form, undefined, 2)}</pre>
			</form>
		</section>
	);
}
