import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DateTime } from "luxon";
import { ACCOUNT_STATUS, RECEIPT_STATUS, RECEIPT_STATUS_ICON, UI_TYPE } from "@/utility";

import Modal from "../modal/modal";
import Button from "../button/button";
import ListEmpty from "../table/empty/list-empty";
import IconReplace from "../../../../../public/replace.svg";

import "./history-table.scss";
import Receipt from "../../types/Receipt";
import DetectOutsideClick from "../detect-outside-click/detect-outside-click";
import HoverBubble from "../hover-bubble/hover-bubble";
import { useRouter } from "next/navigation";

const HistoryTable = (props: any) => {
	// null = loading
	// [] = empty
	// [...] = show table
	const { push } = useRouter();
	// const [lastReason, setLastReason] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [filteredList, setFilteredList] = useState<any>(null);
	const [receipt, setReceipt] = useState<Receipt | null>(null);

	useEffect(() => {
		setFilteredList(props.list);
	}, [props.list]);

	const getRejectReason = async (receipt: Receipt, index: number) => {
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
					console.log(data);
					const newList = filteredList.map((item: Receipt) =>
						item._id === data.receiptRef ? { ...item, ...{ rejectReason: data.content } } : item
					);
					// Re-render with the new array
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
															onClick={() => setReceipt(item)}
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
																	item.status === RECEIPT_STATUS.DENIED &&
																	getRejectReason(item, index)
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
			<Modal isShown={receipt}>
				<DetectOutsideClick action={() => setReceipt(null)}>
					<div
						style={{
							width: "400px",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Image
							alt="qr"
							height={0}
							width={0}
							src={`${process.env.NEXT_PUBLIC_API}/uploads/receipts/${
								receipt && receipt.receiptName
							}`}
							onClick={() =>
								(receipt?.status === RECEIPT_STATUS.PENDING ||
									receipt?.status === RECEIPT_STATUS.DENIED) &&
								inputRef.current!.click()
							}
							unoptimized
							style={{ height: "90%", width: "auto", borderRadius: 10 }}
							onErrorCapture={(e: any) => {
								e.currentTarget.src = "/leaf.png";
								e.currentTarget.className = "error";
							}}
						/>

						<input
							name={props.name}
							ref={inputRef}
							type="file"
							accept=".png,.jpg,.jpeg,.pdf"
							onChange={(e: any) =>
								props
									.handleFileChange(receipt, e.currentTarget.files[0])
									.then(() => setReceipt(null))
							}
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
							onClick={() => setReceipt(null)}
							style={{
								marginTop: "20px",
							}}
						>
							CLOSE
						</Button>
					</div>
				</DetectOutsideClick>
			</Modal>
		</>
	);
};

export default HistoryTable;
