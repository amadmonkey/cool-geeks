"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Button from "@/app/ui/components/button/button";
import Section from "@/app/ui/components/section/section";
import Dropdown from "@/app/ui/components/dropdown/dropdown";
import FormGroup from "@/app/ui/components/form-group/form-group";
import TextInput from "@/app/ui/components/text-input/text-input";

import IconAddUser from "../../../../../../public/add-user.svg";
import IconMidmonth from "../../../../../../public/midmonth.svg";
import IconEndOfMonth from "../../../../../../public/end-of-month.svg";

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
		subd: { _id: "", price: "", code: "" },
		plan: { price: "" },
	});
	const [subdList, setSubdList] = useState<any>([]);
	const [planList, setPlanList] = useState<any>([]);
	const [cutOffError, setCutOffError] = useState<string | null>(null);
	const [error, setError] = useState<any>("");
	const [userCount, setUserCount] = useState(0);

	const onSelect = async (selectId: any, newVal: any) => {
		let newFormObj = { ...form, ...{ [`${selectId}`]: newVal } };
		if (selectId === "subd") {
			// if subd changed refresh plans
			newFormObj = { ...newFormObj, ...{ plan: { price: "" } } };
			await getPlans(newFormObj.subd._id);
		}
		setForm(newFormObj);
	};

	const updateForm = (e: any) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const getSubds = async () => {
		const searchOptions = new URLSearchParams({
			filter: JSON.stringify({
				active: true,
			}),
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

	const getPlans = async (id: string) => {
		const searchOptions = new URLSearchParams({
			filter: JSON.stringify({
				subdRef: id,
				active: true,
			}),
			sort: JSON.stringify({
				name: "asc",
				code: "asc",
			}),
		});
		return await fetch(`${process.env.NEXT_PUBLIC_MID}/api/plan?${searchOptions}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})
			.then((res) => res.json())
			.then(async (res) => {
				const { code, data } = res;
				switch (code) {
					case 200:
						setPlanList(data);
						break;
					case 401:
						push("/login");
						break;
					default:
						console.log("get subds default", data);
						push("/login");
						break;
				}
			})
			.catch((err) => console.log("getPlans catch", err));
	};

	const getUserCount = async () => {
		// const searchOptions = new URLSearchParams(filter.values);
		const searchOptions = new URLSearchParams({
			page: "1",
			limit: "",
			sort: JSON.stringify({
				name: "asc",
				code: "asc",
			}),
		});

		await fetch(`${process.env.NEXT_PUBLIC_MID}/api/user?${searchOptions}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})
			.then((res) => res.json())
			.then((res) => {
				const { code, data } = res;
				const { list } = data;
				switch (code) {
					case 200:
						setUserCount(list.length + 1);
						break;
					case 401:
						push("/login");
						break;
					default:
						push("/login");
						break;
				}
			});
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
		getUserCount();
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
					accountNumber: setAccountNumber(form.subd.code, userCount),
				}),
			});
			const { code, data } = await res.json();
			switch (code) {
				case 200:
					toast.success("Account created successfully.");
					push("/admin/accounts");
					break;
				case 400:
					setError(data.message);
					break;
				default:
					push("/login");
					break;
			}
		} catch (err) {
			console.error(err);
		}
	};

	const setAccountNumber = (code: string, count: number) =>
		`${code}-${new Date().getFullYear()}-${(count + "").padStart(4, "0")}`.toUpperCase();

	const validate = (e: any) => {
		e.preventDefault();
		if (!form.cutoff) {
			setCutOffError("Please select a cut off type");
			return false;
		}
		return true;
	};

	return (
		<Section title={sectionTitle}>
			<div style={{ display: "flex", justifyContent: "center", gap: 50 }}>
				<form
					onSubmit={(e: any) => validate(e) && handleSubmit(e)}
					style={{ display: "flex", flexDirection: "column", gap: 50 }}
				>
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
											{setAccountNumber(form.subd.code, userCount)}
										</p>
									</div>
								</div>
							)}
							<FormGroup label="Preferred Cutoff">
								<div className="cutoff-container">
									<label className={form.cutoff === "MID" ? "active" : ""} tabIndex={0}>
										<IconMidmonth />
										<input type="radio" name="cutoff" value="MID" onChange={updateForm} />
										<span>MIDMONTH</span>
									</label>
									<label className={form.cutoff === "END" ? "active" : ""} tabIndex={0}>
										<IconEndOfMonth />
										<input type="radio" name="cutoff" value="END" onChange={updateForm} />
										<span>END OF MONTH</span>
									</label>
								</div>
								{cutOffError && <span className="general-error">{cutOffError}</span>}
								<p className="input-info">
									Midmonth warns every 15<sup>th</sup> and cuts every 19<sup>th</sup>. End of month
									warns at whatever the last day of the month is and cuts at the 4<sup>th</sup> the
									following month.
								</p>
							</FormGroup>
						</div>
					</div>
					{error && <span className="general-error box">{error}</span>}
					<FormGroup style={{ width: "300px", alignSelf: "end" }}>
						<Button type="submit" className="info" style={{ display: "flex", gap: 10 }}>
							<IconAddUser style={{ height: "25px", width: "auto" }} />
							ADD CLIENT
						</Button>
					</FormGroup>
					{/* <pre>{JSON.stringify(planList, undefined, 2)}</pre> */}
				</form>
			</div>
		</Section>
		// <section
		// 	style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
		// >
		// 	<header className="page-header">
		// 		<h1
		// 			className="section-title"
		// 			style={{
		// 				display: "flex",
		// 				marginBottom: "unset",
		// 				gap: "5px",
		// 				alignItems: "center",
		// 			}}
		// 		></h1>
		// 	</header>
		// </section>
	);
}

const sectionTitle = (
	<>
		<IconAddUser />
		Create New Account
	</>
);
