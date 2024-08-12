import React, { useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { RECEIPT_STATUS, RECEIPT_STATUS_ICON } from "@/utility";
import Image from "next/image";

import Modal from "../modal/modal";
import Button from "../button/button";
import Receipt from "../../types/Receipt";
import ListEmpty from "../table/empty/list-empty";
import HoverBubble from "../hover-bubble/hover-bubble";
import DetectOutsideClick from "../detect-outside-click/detect-outside-click";

import IconLoader from "../../../../../public/loader.svg";
import IconReplace from "../../../../../public/replace.svg";

import "./history-table.scss";

const HistoryTable = (props: any) => {
	// null = loading
	// [] = empty
	// [...] = show table
	const { push } = useRouter();
	// const signal = useRef<any>();
	// const controller = useRef<any>();
	const loadingToastId = useRef<any>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [filteredList, setFilteredList] = useState<any>(null);
	const [isModalShown, setIsModalShown] = useState<boolean>(false);
	const [receipt, setReceipt] = useState<Receipt | null>(null);
	const [receiptUrl, setReceiptUrl] = useState<string>("");

	const showReceipt = (newReceipt: Receipt) => {
		if (receipt?._id === newReceipt._id) {
			setReceiptUrl(newReceipt.receiptUrl || "");
		} else {
			setReceipt(newReceipt);
		}
		setIsModalShown(true);
	};

	const getRejectReason = async (receipt: Receipt) => {
		if (!receipt.rejectReason) {
			const searchOptions = new URLSearchParams({
				filter: JSON.stringify({
					receiptRef: receipt._id,
				}),
				action: "/reason",
			});
			const { code, data } = await fetch(`/api/receipt?${searchOptions}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			}).then((res) => res.json());
			switch (code) {
				case 200:
					const newList = filteredList.map((item: Receipt) =>
						item._id === receipt._id
							? {
									...item,
									...{
										rejectReason: data ? (
											data.content
										) : (
											<>
												No reason specified.
												<br /> Please contact <strong className="text-info">
													[name here]
												</strong> at <strong className="text-info">[number here]</strong> for more
												details
											</>
										),
									},
							  }
							: item
					);
					setFilteredList(newList);
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

	const closeModal = () => {
		if (isModalShown) {
			setReceiptUrl("");
			setIsModalShown(false);
		}
	};

	useEffect(() => {
		const getImage = async (id: string) => {
			const imageUrl = await props.getImage(id);

			const newList = filteredList.map((item: Receipt) =>
				item._id === receipt!._id ? { ...item, ...{ receiptUrl: imageUrl } } : item
			);

			setFilteredList(newList);
			setReceiptUrl(imageUrl);
		};

		try {
			if (receipt) {
				if (receipt?.receiptUrl) {
					setReceiptUrl(receipt?.receiptUrl);
				} else {
					getImage(receipt.gdriveId);
				}
			}
		} catch (err) {
			console.log(err);
		}
	}, [receipt]);

	useEffect(() => {
		setReceiptUrl("");
		setReceipt(null);
		setFilteredList(props.list);
	}, [props.list]);

	return (
		<>
			<div>
				{filteredList ? (
					filteredList.length ? (
						<table className="history-table">
							<thead className="sr-only">
								<tr>
									<th>Date</th>
									<th>Rate</th>
									<th>Reference Number</th>
									<th>Receipt</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{filteredList.map((item: Receipt, index: number) => {
									return (
										<tr key={item._id + index} className={item.status?.toLowerCase()}>
											<td>
												<span className="date">
													{DateTime.fromISO(item.receiptDate).toFormat("LLLL yyyy")}
												</span>
											</td>
											<td>
												<span className="rate">₱{item.planRef.price}</span>
											</td>
											<td>
												{item.referenceType ? (
													<span className="refNo">
														<Image
															src={item.referenceType && `/${item.referenceType.name}.png`}
															height={0}
															width={0}
															style={{ height: "20px", width: "auto" }}
															sizes="100vw"
															alt="Picture of the author"
															onErrorCapture={(e: any) => {
																e.currentTarget.src = "/leaf.png";
																e.currentTarget.className = "error";
															}}
														/>
														{item.referenceNumber}
													</span>
												) : (
													<span>RECEIPT SUBMISSION FAILED</span>
												)}
											</td>
											{item.status !== "FAILED" && (
												<>
													<td>
														<button
															className="receipt-button invisible"
															onClick={() => showReceipt(item)}
														>
															<Image
																src={`/image.svg`}
																height={0}
																width={0}
																style={{ height: "20px", width: "auto" }}
																sizes="100vw"
																alt="Picture of the author"
																onErrorCapture={(e: any) => {
																	e.currentTarget.src = "/leaf.png";
																	e.currentTarget.className = "error";
																}}
															/>
														</button>
													</td>
													<td>
														<HoverBubble
															style={{ display: "flex", gap: "3px" }}
															message={item.rejectReason}
															disabled={item.status !== RECEIPT_STATUS.DENIED}
															right
														>
															<span
																className="invisible"
																onMouseEnter={() =>
																	item.status === RECEIPT_STATUS.DENIED && getRejectReason(item)
																}
															>
																{RECEIPT_STATUS_ICON(item.status, null)}
															</span>
														</HoverBubble>
													</td>
												</>
											)}
										</tr>
									);
								})}
							</tbody>
						</table>
					) : (
						<ListEmpty label="NO ENTRIES" />
					)
				) : (
					<table className="history-table">
						<thead className="sr-only">
							<tr>
								<th>Date</th>
								<th>Rate</th>
								<th>Reference Number</th>
								<th>Receipt</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody className="loading">
							{Array.from(Array(5).keys()).map((item: any, index: number) => {
								return (
									<tr key={index} className={item.status?.toLowerCase()}>
										<td>
											<span className="date skeleton" style={{ width: "100%" }}>
												&nbsp;
											</span>
										</td>
										<td>
											<span
												className="rate skeleton"
												style={{ width: "100%", borderRadius: "5px" }}
											>
												&nbsp;
											</span>
										</td>
										<td>
											<span
												className="refNo skeleton"
												style={{ width: "100%", borderRadius: "5px" }}
											>
												&nbsp;
											</span>
										</td>
										{item.status !== "FAILED" && (
											<>
												<td className="skeleton" style={{ borderRadius: "5px", margin: "5px" }}>
													<button className="invisible">&nbsp;</button>
												</td>
												<td className="skeleton" style={{ borderRadius: "5px", margin: "5px" }}>
													&nbsp;
												</td>
											</>
										)}
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
			<Modal isShown={isModalShown}>
				<DetectOutsideClick action={closeModal}>
					<div
						style={{
							width: "400px",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						{/* TODO: convert to button click bitch */}
						{receiptUrl ? (
							<>
								<Image
									alt="qr"
									height={0}
									width={0}
									src={receiptUrl || "./loader.svg"}
									onClick={() =>
										(receipt?.status === RECEIPT_STATUS.PENDING ||
											receipt?.status === RECEIPT_STATUS.DENIED) &&
										inputRef.current!.click()
									}
									style={{ height: "90%", width: "auto", borderRadius: 10 }}
								/>

								<input
									name={props.name}
									ref={inputRef}
									type="file"
									accept=".png,.jpg,.jpeg,.pdf"
									onChange={(e: any) => {
										setReceiptUrl("");
										setIsModalShown(false);

										loadingToastId.current = toast("Updating receipt...", {
											autoClose: false,
											icon: <IconLoader style={{ height: "20px", stroke: "rgb(100, 100, 100)" }} />,
										});
										props
											.handleFileChange(receipt, e.currentTarget.files[0])
											.then(closeModal)
											.then(() => {
												toast.dismiss(loadingToastId.current);
											});
									}}
									style={{ display: "none" }}
									disabled={props.disabled}
								/>
								{(receipt?.status === RECEIPT_STATUS.DENIED ||
									receipt?.status === RECEIPT_STATUS.PENDING) && (
									<button onClick={() => inputRef.current!.click()} className="replace-button">
										<IconReplace /> CHANGE
									</button>
								)}
								<Button
									onClick={closeModal}
									style={{
										marginTop: "20px",
									}}
								>
									CLOSE
								</Button>
							</>
						) : (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: "20px",
								}}
							>
								<IconLoader style={{ height: "50px", width: "50px", stroke: "#626262" }} />
								<p style={{ fontWeight: 800 }}>Loading receipt. Please wait...</p>
							</div>
						)}
					</div>
				</DetectOutsideClick>
			</Modal>
		</>
	);
};

export default HistoryTable;
