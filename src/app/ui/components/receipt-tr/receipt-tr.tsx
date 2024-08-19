import React, { useEffect, useState } from "react";
import Receipt from "../../types/Receipt";
import Image from "next/image";
import { RECEIPT_STATUS, RECEIPT_STATUS_BADGE } from "@/utility";

import Switch from "../switch/switch";
import IconDeny from "@/public/denied.svg";
import IconAccept from "@/public/done.svg";
import IconReplace from "@/public/replace.svg";
import IconLoading from "@/public/loading.svg";
import ConfirmModal from "../confirm-modal/confirm-modal";

interface Props {
	data: Receipt;
	updateReceipt: Function;
	updateConfirmTemplate: Function;
}

const ReceiptTr = (props: Props) => {
	const [receipt, setReceipt] = useState(props.data);
	const [rejectReason, setRejectReason] = useState("");
	const receiptDate = new Date(props.data.receiptDate);
	const [loading, setLoading] = useState<boolean>(false);

	const handleUpdateStatus = (data: any) => {
		// showConfirmModal(data);
		props.updateReceipt(data);
		setLoading(true);
	};

	useEffect(() => {
		setReceipt(props.data);
		setLoading(false);
	}, [props.data]);

	return (
		<tr className={`receipts ${receipt.status === "FAILED" ? "row-failed" : ""}`}>
			<td>
				<span
					style={{
						color: receipt.status === "FAILED" ? "#e46d6d" : "#5576c7",
						fontSize: "15px",
						fontWeight: "800",
					}}
				>{`${receipt.userRef.firstName} ${receipt.userRef.lastName}`}</span>
				<br />
				<span style={{ fontSize: "13px" }}>{receipt.planRef.subdRef.name}</span>
				<br />
				{receipt.userRef.accountNumber}
			</td>
			<td>
				<span>{receipt.planRef.name}</span>
				<br />
				<span style={{ fontSize: "20px", fontWeight: "bold" }}>₱{receipt.planRef.price}</span>
			</td>
			<td>
				{receipt.cutoff === "MID" ? "Midmonth" : "End of Month"}
				<br />
				{`${receiptDate.toLocaleDateString("default", {
					month: "long",
				})} ${receiptDate.getFullYear()}`}
			</td>
			{receipt.status !== "FAILED" ? (
				<>
					<td>{new Date(receipt.createdAt).toDateString()}</td>
					<td>{receipt.referenceNumber}</td>
					<td>
						<button className="invisible">
							<Image
								src={`/image.svg`}
								height={0}
								width={0}
								style={{ height: "20px", width: "auto" }}
								sizes="100vw"
								alt="Image icon button"
							/>
						</button>
					</td>
					<td
						style={{
							display: "flex",
							justifyContent: "center",
							alignContent: "center",
						}}
					>
						{RECEIPT_STATUS_BADGE(receipt.status)}
					</td>
					<td>
						{loading ? (
							<div style={{ display: "flex", justifyContent: "center" }}>
								<IconLoading style={{ height: "10px" }} />
							</div>
						) : (
							<ConfirmModal
								template={(data: any) => {
									if (data) {
										return props.updateConfirmTemplate(data, rejectReason, setRejectReason);
									}
								}}
								continue={(data: any) => {
									handleUpdateStatus({ ...receipt, ...{ status: data.action }, rejectReason });
								}}
								cancel={() => {
									setLoading(false);
								}}
							>
								{(showConfirmModal: Function) => {
									return receipt.status === RECEIPT_STATUS.PENDING ? (
										<>
											<label htmlFor="deny" className="sr-only">
												Deny
											</label>
											<button
												name="deny"
												className="invisible button__action"
												onClick={() => showConfirmModal({ data: receipt, action: "DENIED" })}
											>
												<IconDeny className="invalid" />
											</button>
											<label htmlFor="deny" className="sr-only">
												Deny
											</label>
											<button
												name="accept"
												className="invisible button__action"
												onClick={() => showConfirmModal({ data: receipt, action: "ACCEPTED" })}
											>
												<span className="sr-only">Accept</span>
												<IconAccept className="success" />
											</button>
										</>
									) : (
										<>
											<label htmlFor="deny" className="sr-only">
												Change Status
											</label>
											<button
												name="change-status"
												className="invisible button__action"
												onClick={() => showConfirmModal({ data: receipt, action: "PENDING" })}
											>
												<span className="sr-only">Change Status</span>
												<IconReplace />
											</button>
										</>
									);
								}}
							</ConfirmModal>
						)}
					</td>
				</>
			) : (
				<>
					<td
						style={{
							fontSize: "20px",
							fontWeight: "800",
							letterSpacing: "10px",
						}}
					>
						NO RECEIPT SUBMITTED
					</td>
					<td>
						<Switch
							name="edit"
							id={receipt._id}
							label={
								<div style={{ display: "flex", alignItems: "center", gap: 5 }}>User Status</div>
							}
							onChange={() => console.log("change user status")}
							mini
						/>
					</td>
				</>
			)}
		</tr>
	);
};

export default ReceiptTr;
