"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import Link from "next/link";
import Image from "next/image";
import Table from "@/app/ui/components/table/table";
import Button from "@/app/ui/components/button/button";
import Dropdown from "@/app/ui/components/dropdown/dropdown";
import TextInput from "@/app/ui/components/text-input/text-input";
import FormGroup from "@/app/ui/components/form-group/form-group";
import FileInput from "@/app/ui/components/file-input/file-input";
import IconQR from "../../../public/qr.svg";
import "./page.scss";

export default function Home() {
	const { push } = useRouter();
	const [currentPayment, setCurrentPayment] = useState(null);
	const [historyList, setHistoryList] = useState<any>(null);
	const [form, setForm] = useState({
		receipt: "",
		receiptName: "",
		referenceType: {
			id: 1,
			name: "gcash",
			icon: "", // blob
		},
		referenceNumber: "",
	});

	const updateForm = (e: any) => {
		let { name, value, type } = e.target;
		setForm((prev) => ({ ...prev, [name]: type === "file" ? value.current.files[0] : value }));
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		const user = JSON.parse(getCookie("user")!);
		const formData = new FormData();
		formData.append("referenceType", JSON.stringify(form.referenceType));
		formData.append("referenceNumber", form.referenceNumber);
		formData.append("receipt", form.receipt);
		formData.append(
			"receiptName",
			`${user.accountNumber}.${form.referenceType.name}.${Date.now()}`
		);
		const { code, data } = await fetch("/api/payment", {
			method: "POST",
			headers: {},
			body: formData,
			credentials: "include",
		}).then((res) => res.json());
		switch (code) {
			case 200:
				console.log("payment submit 200", data);
				setHistoryList([data, ...historyList]);
				break;
			case 400:
				// handle errors
				console.log("payment submit 400", data);
				break;
			default:
				console.log("payment submit default", data);
				push("/login");
				break;
		}
	};

	const helpTemplate = () => (
		<div className="qr-container">
			<Image
				alt="qr"
				height={0}
				width={0}
				src="/qr.png"
				unoptimized
				style={{ height: "150px", width: "auto" }}
			/>
		</div>
	);

	const getHistoryList = async () => {
		return await fetch("/api/payment", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		}).then((res) => res.json());
	};

	useEffect(() => {
		let mounted = true;
		getHistoryList()
			.then((res) => {
				if (mounted) {
					const { code, data } = res;
					console.log("getHistoryList", data);
					switch (code) {
						case 200:
							setCurrentPayment(data.currentPayment);
							setHistoryList(data.list);
							break;
						case 401:
							push("/login");
							break;
						default:
							console.log("payment submit default", data);
							push("/login");
							break;
					}
				}
			})
			.catch((err) => console.log("getHistoryList catch", err));
		return () => {
			mounted = false;
		};
	}, [push]);

	return (
		<main>
			<div className="content" style={{ maxWidth: "1400px", width: "100%" }}>
				<section
					style={{
						maxWidth: "400px",
						flexDirection: "column",
						flexBasis: "40%",
					}}
				>
					<h1 className="section-title">Submit Payment Receipt</h1>
					{currentPayment ? (
						"paid"
					) : (
						<form onSubmit={handleSubmit} style={{ gap: "30px" }} encType="multipart/form">
							<FormGroup
								label="Payment Receipt/Screenshot"
								help={{ icon: <IconQR />, body: helpTemplate() }}
							>
								<FileInput name="receipt" value={form.receipt} onChange={updateForm} />
							</FormGroup>
							<FormGroup label="Payment Transaction/Reference Number" required>
								<TextInput
									type="mini-dropdown"
									name="referenceNumber"
									minLength="15"
									maxLength="15"
									value={form.referenceNumber}
									setValue={setForm}
									onChange={updateForm}
									miniDropdownList={[
										{
											id: 1,
											name: "gcash",
											icon: "", // blob
										},
										{
											id: 2,
											name: "bpi",
											icon: "", // blob
										},
									]}
									required
								/>
								<p className="input-info">
									Select the correct payment method and enter the reference number during payment
								</p>
							</FormGroup>
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
											fontSize: "14px",
											letterSpacing: "8px",
										}}
									>
										RATE
									</span>
									<p style={{ width: "100%", fontWeight: "800", fontSize: "30px" }}>₱1000</p>
								</div>
							</div>
							<FormGroup>
								<Button type="submit">SEND RECEIPT</Button>
							</FormGroup>
						</form>
					)}
					{/* <pre>{JSON.stringify(form, undefined, 2)}</pre> */}
				</section>
				<section
					style={{
						flexDirection: "column",
						flexBasis: "600px",
						padding: "0 20px",
					}}
				>
					<h1 className="section-title"></h1>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "30px",
						}}
					>
						<div style={{ display: "flex", width: "70%", gap: "10px" }}>
							<Dropdown
								list={[
									{ id: 1, name: "2024" },
									{ id: 2, name: "2023" },
									{ id: 3, name: "2022" },
									{ id: 4, name: "2021" },
									{ id: 5, name: "2020" },
									{ id: 6, name: "2019" },
									{ id: 7, name: "2018" },
								]}
								style={{ width: "100px" }}
								placeholder="YEAR"
							/>
							<Dropdown
								list={[
									{ id: 1, name: "January" },
									{ id: 2, name: "February" },
									{ id: 3, name: "March" },
									{ id: 4, name: "April" },
									{ id: 5, name: "May" },
									{ id: 6, name: "June" },
									{ id: 7, name: "July" },
									{ id: 8, name: "August" },
									{ id: 9, name: "September" },
									{ id: 10, name: "October" },
									{ id: 11, name: "November" },
									{ id: 12, name: "December" },
								]}
								style={{ width: "200px" }}
								placeholder="MONTH"
							/>
						</div>
						<Link href="">VIEW ALL</Link>
					</div>
					<div className="home-table">
						<Table list={historyList} />
					</div>
					<pre>{JSON.stringify(historyList, null, 2)}</pre>
				</section>
			</div>
		</main>
	);
}
