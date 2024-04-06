"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/app/ui/components/card/card";
import Button from "@/app/ui/components/button/button";
import Dropdown from "@/app/ui/components/dropdown/dropdown";
import FormGroup from "@/app/ui/components/form-group/form-group";
import TextInput from "@/app/ui/components/text-input/text-input";
import Modal from "@/app/ui/components/modal/modal";

import "./page.scss";

type Subd = {
	_id: string;
	name: string;
	code: string;
	gcash: {
		qr: Object;
		number: string;
	};
};

type Plan = {
	_id: string;
	subdId: string;
	name: string;
	description: string;
	price: string;
};

export default function AddClient() {
	const [form, setForm] = useState({
		firstName: "",
		middleName: "",
		lastName: "",
		address: "",
		contactNo: "",
		email: "",
		subd: { price: "" },
		plan: { price: "" },
	});

	const [subdList, setSubdList] = useState<any>([]);
	const [planList, setPlanList] = useState<any>([]);

	const onSelect = (newVal: any, selectId: any) => {
		let newFormObj = { ...form, ...{ [`${selectId}`]: newVal } };
		if (selectId === "subd") {
			newFormObj = { ...newFormObj, ...{ plan: { price: "" } } };
			setPlanList(newVal.planList);
		}
		setForm(newFormObj);
	};

	const updateForm = (e: any) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	useMemo(() => {
		const subd: any[] = [
			{
				id: 1,
				name: "Saint Mary Homes",
				gcashNo: ["09451785414"],
				planList: [
					{
						id: 1,
						name: "15Mbps",
						description: "",
						price: "700",
					},
					{
						id: 2,
						name: "20Mbps",
						description: "",
						price: "1000",
					},
					{
						id: 3,
						name: "50Mbps",
						description: "",
						price: "1500",
					},
					{
						id: 4,
						name: "250Mbps",
						description: "",
						price: "2500",
					},
				],
			},
			{
				id: 2,
				name: "Pilar Executive",
				gcashNo: ["09190928359"],
				planList: [
					{
						id: 1,
						name: "50Mbps",
						description: "",
						price: "1000",
					},
					{
						id: 2,
						name: "100Mbps",
						description: "",
						price: "1500",
					},
					{
						id: 3,
						name: "150Mbps",
						description: "",
						price: "2000",
					},
					{
						id: 4,
						name: "250Mbps",
						description: "",
						price: "2500",
					},
				],
			},
		];
		setSubdList(subd);
	}, []);

	const handleSubmit = (e: any) => {
		e.preventDefault();
	};

	return (
		<section style={{ width: "100%" }}>
			<Card style={{ display: "flex", justifyContent: "center" }}>
				<form
					onSubmit={handleSubmit}
					style={{ display: "flex", flexDirection: "column", gap: 20, width: "400px" }}
				>
					<FormGroup label="First Name">
						<TextInput
							type="text"
							name="firstName"
							value={form.firstName}
							minLength="2"
							onChange={updateForm}
							required
						/>
					</FormGroup>
					<div
						style={{ display: "flex", width: "100%", justifyContent: "space-between", gap: "10px" }}
					>
						<FormGroup label="Middle Name/Initial">
							<TextInput
								type="text"
								name="middleName"
								value={form.middleName}
								onChange={updateForm}
							/>
						</FormGroup>
						<FormGroup label="Last Name">
							<TextInput
								type="text"
								name="lastName"
								value={form.lastName}
								minLength="2"
								onChange={updateForm}
								required
							/>
						</FormGroup>
					</div>
					<FormGroup label="Address">
						<TextInput
							type="text"
							name="address"
							value={form.address}
							minLength="10"
							onChange={updateForm}
							required
						/>
					</FormGroup>
					<FormGroup label="Contact No">
						<TextInput
							type="tel"
							name="contactNo"
							value={form.contactNo}
							minLength="12"
							maxLength="12"
							onChange={updateForm}
							required
						/>
					</FormGroup>
					<FormGroup label="Email Address">
						<TextInput
							type="email"
							name="email"
							value={form.email}
							onChange={updateForm}
							required
						/>
					</FormGroup>
					<div
						style={{ display: "flex", width: "100%", justifyContent: "space-between", gap: "10px" }}
					>
						<FormGroup label="Subd" double>
							<Dropdown
								list={subdList}
								value={form.subd}
								onChange={(newVal: any) => onSelect(newVal, "subd")}
								placeholder="Select Subdivision"
								required
							/>
						</FormGroup>
						<FormGroup label="Plan">
							<Dropdown
								list={planList}
								value={form.plan}
								onChange={(newVal: any) => onSelect(newVal, "plan")}
								placeholder="Select Plan"
								required
							/>
						</FormGroup>
					</div>
					{form.subd && form.plan.price && (
						<div className="summary">
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									gap: "20px",
								}}
							>
								<span
									style={{
										textAlign: "right",
										width: "100%",
										fontSize: "16px",
										letterSpacing: "8px",
									}}
								>
									RATE
								</span>
								<p style={{ width: "100%", fontWeight: "800", fontSize: "40px" }}>
									₱{form.plan.price}
								</p>
							</div>
						</div>
					)}
					<FormGroup>
						<Button type="submit">ADD CLIENT</Button>
					</FormGroup>
					<pre>{JSON.stringify(form, undefined, 2)}</pre>
				</form>
			</Card>
			<Modal>
				<Card style={{ width: "400px" }}>
					<span>ACCOUNT NUMBER</span>
					<h1>123456789</h1>
					<Link href="/register" className="cg-button" style={{ marginTop: "20px" }}>
						<span>CONTINUE</span>
					</Link>
				</Card>
			</Modal>
		</section>
	);
}
