"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { createWorker } from "tesseract.js";
import { toast } from "react-toastify";
import { DateTime } from "luxon";
import Link from "next/link";
import Image from "next/image";

import Card from "@/app/ui/components/card/card";
import Button from "@/app/ui/components/button/button";
import TextInput from "@/app/ui/components/text-input/text-input";
import FormGroup from "@/app/ui/components/form-group/form-group";
import FileInput from "@/app/ui/components/file-input/file-input";
import HistoryTable from "@/app/ui/components/history-table/history-table";

import IconQR from "../../../public/qr.svg";
import IconDownload from "../../../public/download.svg";

import {
	CUTOFF_TYPE,
	RECEIPT_STATUS,
	RECEIPT_STATUS_ICON,
	VALID_IMG_TYPES,
	getDaysLeft,
} from "@/utility";

import "./page.scss";
import Receipt from "../ui/types/Receipt";

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

export default function Home() {
	const { push } = useRouter();
	const mounted = useRef(false);
	const [inputInfo, setInputInfo] = useState(
		"Select the correct payment method you used and enter the reference number"
	);
	const [inputDisabled, setInputDisabled] = useState(false);
	const [form, setForm] = useState(defaultForm);
	const [historyList, setHistoryList] = useState<any>(null);
	const [formShown, setFormShown] = useState<Boolean | null>(null);
	const [latestReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
	const [fileError, setFileError] = useState("");
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
		if (hasReferenceNumber) {
			setInputInfo(
				"Reference number found! Please check if we got it right and update accordingly."
			);
		} else {
			setInputInfo(
				"We did not find anything that resembles a reference number in the uploaded image. Please check if you uploaded the correct image. If you did, please disregard this message."
			);
			updateForm({
				target: {
					name: "referenceNumber",
					value: "",
				},
			});
		}
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

	const handleFileChange = async (receipt: Receipt, file: File) => {
		try {
			if (VALID_IMG_TYPES.includes(file.type)) {
				const formData = new FormData();

				formData.append("_id", receipt._id);
				formData.append("receipt", file);

				const { code, data } = await fetch("/api/receipt", {
					method: "POST",
					headers: {},
					body: formData,
					credentials: "include",
				}).then((res) => res.json());
				switch (code) {
					case 200:
						getHistoryList();
						toast.success("Receipt updated");
						break;
					case 400:
						break;
					default:
						break;
				}
			}
		} catch (err) {
			console.error(err);
		}
	};

	const downloadQR = () => {};

	const removeFile = () => setForm((prev) => ({ ...prev, ...{ receipt: "" } }));

	const helpTemplate = () => (
		<div className="qr-container">
			<Image
				alt="qr"
				height={0}
				width={0}
				src={
					user
						? `${process.env.NEXT_PUBLIC_API}/uploads/qr/${user.subdRef.gcash.qr.filename}`
						: "/qr.png"
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
			sort: JSON.stringify({ createdAt: "desc" }),
		});
		const { code, data } = await fetch(`/api/receipt?${searchOptions}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		}).then((res) => res.json());

		// .then((res) => {
		if (mounted) {
			switch (code) {
				case 200:
					setHistoryList(data.list);
					setCurrentReceipt(data.latestReceipt);
					setFormShown(
						data.latestReceipt && data.latestReceipt.status !== RECEIPT_STATUS.FAILED ? false : true
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
	};

	const validate = (e: any) => {
		e.preventDefault();
		if (!form.receipt) {
			setFileError("Please add a receipt");
			return false;
		}
		return true;
	};

	const formatDaysLeft = () => {
		// generate date to compare
		const date = latestReceipt?.receiptDate
			? DateTime.fromISO(latestReceipt?.receiptDate).plus({ month: 2 })
			: DateTime.now().plus({ month: 2 });
		Object.assign(
			date,
			date.set({ day: user.cutoff === CUTOFF_TYPE.MID ? 15 : date.endOf("month").day })
		);
		const { days, hours, minutes } = getDaysLeft(date);
		return days > 0 ? `${days} days` : hours > 0 ? `${hours} hours` : `${minutes} minutes`;
	};

	useEffect(() => {
		getHistoryList();
		console.log("why am i firing twice");
	}, []);

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
						<Card
							className="receipt-status-container skeleton loading"
							style={{ minHeight: "300px" }}
						/>
					) : !formShown ? (
						<Card className="receipt-status-container">
							{RECEIPT_STATUS_ICON(latestReceipt?.status, {
								height: "100px",
								marginBottom: "20px",
							})}
							{latestReceipt!.status === "ACCEPTED" ? (
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
								{latestReceipt && (
									<>
										<li className="summary__item">
											<span>SUBMITTED</span>
											<p>{DateTime.fromISO(latestReceipt.createdAt).toFormat("MMMM d y")}</p>
										</li>
										<li className="summary__item">
											<span>FOR</span>
											<p>{DateTime.fromISO(latestReceipt.createdAt).toFormat("MMMM y")}</p>
										</li>
									</>
								)}
								<li className="summary__item">
									<span>RATE</span>
									<p>₱{user.planRef.price}</p>
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
							{/* <pre>{JSON.stringify(latestReceipt, undefined, 2)}</pre> */}
						</Card>
					) : (
						<form
							onSubmit={(e: Object) => validate(e) && handleSubmit(e)}
							style={{ gap: "30px" }}
							encType="multipart/form"
						>
							<FormGroup
								label="Receipt Receipt/Screenshot"
								help={{ icon: <IconQR />, body: helpTemplate() }}
							>
								<FileInput
									name="receipt"
									removeFile={removeFile}
									value={form.receipt}
									onChange={updateForm}
									disabled={inputDisabled}
								/>
								{fileError && <span className="file-error">{fileError}</span>}
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
								{/* {getNextMonth() && (
									<li className="summary__item">
										<span>RECEIPT FOR</span>
										<p>{getNextMonth()}</p>
									</li>
								)} */}
								<li className="summary__item">
									<span>RECEIPT FOR</span>
									<p>
										{DateTime.fromISO(latestReceipt?.receiptDate || DateTime.now().toString())
											.plus({ month: 1 })
											.toFormat("MMMM")}
									</p>
								</li>
								<li className="summary__item">
									<span>DUE IN</span>
									<p>{formatDaysLeft()}</p>
								</li>
							</ul>
							<FormGroup>
								<Button type="submit" className="info" disabled={inputDisabled}>
									SEND RECEIPT
								</Button>
							</FormGroup>
						</form>
					)}
					{/* <pre>{JSON.stringify(latestReceipt, undefined, 2)}</pre> */}
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
							{/* <Dropdown
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
							/> */}
						</div>
						<Link href="">VIEW ALL</Link>
					</div>
					<div className="home-table">
						<HistoryTable list={historyList} handleFileChange={handleFileChange} />
					</div>
					{/* <pre>{JSON.stringify(historyList, null, 2)}</pre> */}
				</section>
			</div>
		</main>
	);
}
