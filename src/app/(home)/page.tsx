"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import Link from "next/link";
import Image from "next/image";
import HistoryTable from "@/app/ui/components/history-table/history-table";
import Button from "@/app/ui/components/button/button";
import Dropdown from "@/app/ui/components/dropdown/dropdown";
import TextInput from "@/app/ui/components/text-input/text-input";
import FormGroup from "@/app/ui/components/form-group/form-group";
import FileInput from "@/app/ui/components/file-input/file-input";
import Card from "@/app/ui/components/card/card";
import IconQR from "../../../public/qr.svg";
import IconLoading from "../../../public/loading.svg";
import IconDownload from "../../../public/download.svg";

import "./page.scss";
import { GET_STATUS_ICON } from "@/utility";

const defaultForm = {
	receipt: "",
	receiptName: "",
	referenceType: {
		id: 1,
		name: "gcash",
		icon: "",
	},
	referenceNumber: "",
};

type Receipt = {
	_id: string;
	userRef: string;
	planRef: string;
	referenceType: object;
	referenceNumber: string;
	receiptName: string;
	status: string;
	createdAt: string;
	updatedAt: string;
};

export default function Home() {
	const { push } = useRouter();
	const [form, setForm] = useState(defaultForm);
	const [historyList, setHistoryList] = useState<any>(null);
	const [formShown, setFormShown] = useState<Boolean | null>(null);
	const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
	const user = getCookie("user") && JSON.parse(getCookie("user")!);

	const updateForm = (e: any) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("referenceType", JSON.stringify(form.referenceType));
		formData.append("referenceNumber", form.referenceNumber);
		formData.append("receipt", form.receipt);
		formData.append(
			"receiptName",
			`${user.accountNumber}.${form.referenceType.name}.${Date.now()}`
		);
		const { code, data } = await fetch("/api/receipt", {
			method: "POST",
			headers: {},
			body: formData,
			credentials: "include",
		}).then((res) => res.json());
		switch (code) {
			case 200:
				setHistoryList([data, ...historyList]);
				setFormShown(false);
				setCurrentReceipt(data);
				setForm(defaultForm);
				break;
			case 400:
				// handle errors
				console.log("payment submit 400 handle errors", data);
				break;
			default:
				push("/login");
				break;
		}
	};

	const downloadQR = () => {};

	const helpTemplate = () => (
		<div className="qr-container">
			<Image
				alt="qr"
				height={0}
				width={0}
				src={
					user ? `${process.env.NEXT_PUBLIC_API}/qr/${user.subdRef.gcash.qr.filename}` : "/qr.png"
				}
				unoptimized
				style={{ height: "90%", width: "auto", borderRadius: 10 }}
			/>
			<Button
				onClick={() => downloadQR()}
				style={{
					marginTop: "20px",
				}}
				className="info"
			>
				<IconDownload height="18" />
				&nbsp;DOWNLOAD
			</Button>
		</div>
	);

	const getHistoryList = async () => {
		const searchOptions = new URLSearchParams({
			page: "1",
			limit: "10",
			sortBy: "createdAt",
			sortOrder: "desc",
		});
		return await fetch(`/api/receipt?${searchOptions}`, {
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
					switch (code) {
						case 200:
							setHistoryList(data.list);
							setCurrentReceipt(data.currentPayment);
							setFormShown(data.currentPayment ? false : true);
							break;
						case 401:
							push("/login");
							break;
						default:
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
					{formShown === null ? (
						<div className="empty-container">
							<IconLoading />
						</div>
					) : !formShown ? (
						<Card className="payment-status-container">
							{GET_STATUS_ICON(currentReceipt?.status, {
								height: "100px",
								marginBottom: "20px",
							})}
							{currentReceipt!.status === "ACCEPTED" ? (
								<Fragment>
									<h1>Receipt accepted</h1>
									<p>You&apos;re good! Next payment range will be on [date here] to [date here]</p>
								</Fragment>
							) : (
								<Fragment>
									<h1>Receipt submitted</h1>
									<p>Please wait while we take a look at your receipt</p>
								</Fragment>
							)}
							<ul className="summary">
								<li className="summary__item">
									<span>DATE SUBMITTED</span>
									<p>
										{currentReceipt && new Date(currentReceipt.createdAt.toString()).toDateString()}
									</p>
								</li>
								<li className="summary__item">
									<span>RATE</span>
									<p>P1000</p>
								</li>
								<li className="summary__item">
									<span>RECEIPT</span>
									<p>
										<Link href="">Show receipt</Link>
									</p>
								</li>
							</ul>
							<FormGroup style={{ marginTop: "40px", textAlign: "center" }}>
								<p>Wanna pay/already paid in advance?</p>
								<Button className="info" type="button" onClick={() => setFormShown(true)}>
									Show Form
								</Button>
							</FormGroup>
							{/* <pre>{JSON.stringify(currentReceipt, undefined, 2)}</pre> */}
						</Card>
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
								<Button type="submit" className="info">
									SEND RECEIPT
								</Button>
							</FormGroup>
						</form>
					)}
					{/* <pre>{JSON.stringify(form, undefined, 2)}</pre> */}
				</section>
				<section
					style={{
						flexDirection: "column",
						flexBasis: "800px",
						padding: "0 20px",
					}}
				>
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
						<HistoryTable list={historyList} />
					</div>
					{/* <pre>{JSON.stringify(historyList, null, 2)}</pre> */}
				</section>
			</div>
		</main>
	);
}
