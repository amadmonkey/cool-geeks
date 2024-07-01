"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { createWorker } from "tesseract.js";
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

import { CUTOFF_TYPE, RECEIPT_STATUS, RECEIPT_STATUS_ICON, getMonthName } from "@/utility";

import "./page.scss";

const worker = createWorker("eng", 1, {
	logger: (m: any) => {
		console.log(m);
	},
});

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
	receiptDate: any;
	createdAt: string;
	updatedAt: string;
};

export default function Home() {
	const { push } = useRouter();
	const [inputInfo, setInputInfo] = useState(
		"Select the correct payment method you used and enter the reference number"
	);
	const [inputDisabled, setInputDisabled] = useState(false);
	const [form, setForm] = useState(defaultForm);
	const [historyList, setHistoryList] = useState<any>(null);
	const [formShown, setFormShown] = useState<Boolean | null>(null);
	const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
	const user = getCookie("user") && JSON.parse(getCookie("user")!);

	const recognize = async (file: any) => {
		// add loading
		setInputDisabled(true);
		const ret = await (await worker).recognize(file);
		console.log("OCR TEXT", ret.data.text);

		let hasReferenceNumber = false;
		await Promise.all(
			ret.data.text.split("\n").map(async (item) => {
				if (item.includes("Ref No.")) {
					updateForm({
						target: {
							name: "referenceNumber",
							value: item.split(" ").slice(2, 5).join(" "),
						},
					});
					hasReferenceNumber = true;
				}
			})
		);

		setInputInfo(
			hasReferenceNumber
				? "Reference number found! Please check if we got it right and update if we did not."
				: "We have not found anything that resembles a reference number in the uploaded image. Please check if you uploaded the correct image. If you think you did, please disregard this message."
		);

		setInputDisabled(false);
	};

	const updateForm = (e: any) => {
		e.target.type === "file" && e.target.value && recognize(e.target.value);

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
				console.log("receipt submit 400 handle errors", data);
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

	const getNextMonth = () => {
		const date = new Date(currentReceipt?.receiptDate);
		return `${getMonthName(date)} ${date.getFullYear()}`;
	};

	const getDaysLeft = () => {
		const currentDate = new Date();
		const receiptDate = new Date(currentReceipt?.receiptDate);

		const _MS_PER_DAY = 1000 * 60 * 60 * 24;
		const utc1 = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
		const utc2 = Date.UTC(receiptDate.getFullYear(), receiptDate.getMonth(), receiptDate.getDate());

		return Math.floor((utc2 - utc1) / _MS_PER_DAY);
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
							setCurrentReceipt(data.currentReceipt);
							setFormShown(
								data.currentReceipt && data.currentReceipt.status !== RECEIPT_STATUS.FAILED
									? false
									: true
							);
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
					<h1 className="section-title">Submit Receipt</h1>
					{formShown === null ? (
						<div className="empty-container">
							<IconLoading />
						</div>
					) : !formShown ? (
						<Card className="receipt-status-container">
							{RECEIPT_STATUS_ICON(currentReceipt?.status, {
								height: "100px",
								marginBottom: "20px",
							})}
							{currentReceipt!.status === "ACCEPTED" ? (
								<Fragment>
									<h1>Receipt accepted</h1>
									<p>You&apos;re good! Next receipt range will be on [date here] to [date here]</p>
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
									<span>FOR</span>
									<p>
										{currentReceipt &&
											new Date(currentReceipt.receiptDate.toString()).toDateString()}
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
								label="Receipt Receipt/Screenshot"
								help={{ icon: <IconQR />, body: helpTemplate() }}
							>
								<FileInput
									name="receipt"
									value={form.receipt}
									onChange={updateForm}
									disabled={inputDisabled}
								/>
							</FormGroup>
							<FormGroup label="Receipt Transaction/Reference Number" required>
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
									disabled={inputDisabled}
									required
								/>
								<p className="input-info">{inputInfo}</p>
							</FormGroup>

							<ul className="summary">
								<li className="summary__item">
									<span>PLAN</span>
									<p>{user.planRef.name}</p>
								</li>
								<li className="summary__item">
									<span>RATE</span>
									<p>₱{user.planRef.price}</p>
								</li>
								<li className="summary__item">
									<span>CUTOFF</span>
									<p>{user.cutoff === CUTOFF_TYPE.MID ? "15th" : "30th"}</p>
								</li>
								<li className="summary__item">
									<span>RECEIPT FOR</span>
									<p>{getNextMonth()}</p>
								</li>
								<li className="summary__item">
									<span>DUE IN</span>
									<p>{getDaysLeft()} days</p>
								</li>
							</ul>
							<FormGroup>
								<Button type="submit" className="info">
									SEND RECEIPT
								</Button>
							</FormGroup>
						</form>
					)}
					{/* <pre>{JSON.stringify(currentReceipt, undefined, 2)}</pre> */}
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
