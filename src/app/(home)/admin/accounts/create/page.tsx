"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Button from "@/app/ui/components/button/button";
import Dropdown from "@/app/ui/components/dropdown/dropdown";
import FormGroup from "@/app/ui/components/form-group/form-group";
import TextInput from "@/app/ui/components/text-input/text-input";

import IconAddUser from "../../../../../../public/add-user.svg";

import "./page.scss";

export default function AddAccount() {
	const { push } = useRouter();
	const [form, setForm] = useState({
		firstName: "",
		middleName: "",
		lastName: "",
		address: "",
		contactNo: "",
		email: "",
		cutoff: "",
		subd: { price: "", code: "" },
		plan: { price: "" },
	});

	const [subdList, setSubdList] = useState<any>([]);
	const [planList, setPlanList] = useState<any>([]);

	const onSelect = (selectId: any, newVal: any) => {
		let newFormObj = { ...form, ...{ [`${selectId}`]: newVal } };
		if (selectId === "subd") {
			newFormObj = { ...newFormObj, ...{ plan: { price: "" } } };
			setPlanList(newVal.plans);
		}
		setForm(newFormObj);
	};

	const updateForm = (e: any) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const getSubds = async () => {
		const searchOptions = new URLSearchParams({
			page: "1",
			limit: "5",
			sort: JSON.stringify({
				name: "asc",
				code: "asc",
			}),
		});
		return await fetch(`${process.env.NEXT_PUBLIC_MID}/api/subd?${searchOptions}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		}).then((res) => res.json());
	};

	useEffect(() => {
		getSubds()
			.then((res) => {
				const { code, data } = res;
				switch (code) {
					case 200:
						setSubdList(data);
						break;
					case 401:
						push("/login");
						break;
					default:
						console.log("getSubds default", data);
						push("/login");
						break;
				}
			})
			.catch((err) => console.error(err));
	}, [push]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/user/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					...form,
					accountNumber: `${form.subd.code}-${new Date().getFullYear()}-${Date.now()}`,
				}),
			});
			const { code, data } = await res.json();
			switch (code) {
				case 200:
					push("/admin/accounts");
					break;
				case 400:
					// setError(data.general);
					break;
				default:
					push("/login");
					break;
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<section
			style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
		>
			<header className="page-header">
				<h1
					className="section-title"
					style={{
						display: "flex",
						marginBottom: "unset",
						gap: "5px",
						alignItems: "center",
					}}
				>
					<IconAddUser />
					Create New Account
				</h1>
			</header>
			<div style={{ display: "flex", gap: 50 }}>
				<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 50 }}>
					<div style={{ display: "flex", flexDirection: "row", gap: 50 }}>
						<div style={{ width: "400px", display: "flex", flexDirection: "column", gap: 20 }}>
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
								style={{
									display: "flex",
									width: "100%",
									justifyContent: "space-between",
									gap: "10px",
								}}
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
						</div>
						<div style={{ width: "400px", display: "flex", flexDirection: "column", gap: 20 }}>
							<div
								style={{
									display: "flex",
									width: "100%",
									justifyContent: "space-between",
									gap: "10px",
								}}
							>
								<FormGroup label="Subd">
									<Dropdown
										list={subdList}
										value={form.subd}
										onChange={(newVal: any) => onSelect("subd", newVal)}
										placeholder="Select Subdivision"
										required
									/>
								</FormGroup>
								<FormGroup label="Plan">
									<Dropdown
										list={planList}
										value={form.plan}
										onChange={(newVal: any) => onSelect("plan", newVal)}
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
												width: "50%",
												fontSize: "11px",
												letterSpacing: "8px",
											}}
										>
											RATE
										</span>
										<p style={{ width: "100%", fontWeight: "800", fontSize: "16px" }}>
											₱{form.plan.price}
										</p>
									</div>
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
												width: "50%",
												fontSize: "11px",
												letterSpacing: "8px",
											}}
										>
											ACCOUNT NUMBER
										</span>
										<p style={{ width: "100%", fontWeight: "800", fontSize: "16px" }}>
											{`${form.subd.code}-${new Date().getFullYear()}-${Date.now()}`}
										</p>
									</div>
								</div>
							)}
							<FormGroup label="Preferred Cutoff">
								<div className="receipt-date-container">
									<label className={form.cutoff === "MID" ? "active" : ""} tabIndex={0}>
										<Image
											src={`/midmonth.svg`}
											height={0}
											width={0}
											sizes="100vw"
											alt="Midmonth icon"
										/>
										<input type="radio" name="cutoff" value="MID" onChange={updateForm} />
										<span>MIDMONTH</span>
									</label>
									<label className={form.cutoff === "END" ? "active" : ""} tabIndex={0}>
										<Image
											src={`/end-of-month.svg`}
											height={0}
											width={0}
											sizes="100vw"
											alt="End of month icon"
										/>
										<input type="radio" name="cutoff" value="END" onChange={updateForm} />
										<span>END OF MONTH</span>
									</label>
								</div>
								<p className="input-info">
									Midmonth warns every 15<sup>th</sup> and cuts every 19<sup>th</sup>. End of month
									warns at whatever the last day of the month is and cuts at the 4<sup>th</sup> the
									following month.
								</p>
							</FormGroup>
						</div>
					</div>
					<FormGroup style={{ width: "300px", alignSelf: "end" }}>
						<Button type="submit" className="info" style={{ display: "flex", gap: 10 }}>
							<IconAddUser style={{ height: "25px", width: "auto" }} />
							ADD CLIENT
						</Button>
					</FormGroup>
					{/* <pre>{JSON.stringify(form, undefined, 2)}</pre> */}
				</form>
			</div>
			{/* <Modal>
				<Card style={{ width: "400px" }}>
					<span>ACCOUNT NUMBER</span>
					<h1>123456789</h1>
					<Link href="/register" className="cg-button" style={{ marginTop: "20px" }}>
						<span>CONTINUE</span>
					</Link>
				</Card>
			</Modal> */}
		</section>
	);
}
