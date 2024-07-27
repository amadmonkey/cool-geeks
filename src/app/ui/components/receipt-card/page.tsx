import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DateTime } from "luxon";
import { ACCOUNT_STATUS, CUTOFF_TYPE, getDaysLeft, RECEIPT_STATUS } from "@/utility";

import Card from "@/app/ui/components/card/card";

import Receipt from "../../types/Receipt";
import IconAccept from "../../../../../public/done.svg";
import IconInvalid from "../../../../../public/invalid.svg";
import IconReplace from "../../../../../public/replace.svg";

interface Props {
	data: Receipt;
	showConfirmModal: Function;
}

const ReceiptCard = (props: Props) => {
	const [loading, setLoading] = useState(false);
	const [receipt, setReceipt] = useState(props.data);
	const { days, hours } = getDaysLeft(DateTime.fromISO(props.data.receiptDate));

	useEffect(() => {
		setReceipt(props.data);
	}, [props.data]);

	return (
		<div key={props.data._id} className="receipt-card">
			<div className="image-container">
				<Image
					alt="qr"
					height={0}
					width={0}
					src={`${process.env.NEXT_PUBLIC_API}/uploads/receipts/${receipt.receiptName}`}
					unoptimized
				/>
			</div>
			<Card className={`receipt-details ${receipt.status?.toLowerCase() || ""}`}>
				<div className="header">
					<span>{`${receipt.userRef.firstName} ${receipt.userRef.lastName}`}</span>
					<div style={{ display: "flex", gap: "5px" }}>
						{receipt.cutoff === CUTOFF_TYPE.MID ? (
							<Image
								className="cutoff-icon"
								src={`/midmonth.svg`}
								height={0}
								width={0}
								sizes="100vw"
								alt="MIDMONTH ICON"
							/>
						) : (
							<Image
								className="cutoff-icon"
								src={`/end-of-month.svg`}
								height={0}
								width={0}
								sizes="100vw"
								alt="END OF MONTH ICON"
							/>
						)}
						<button className="invisible">...</button>
					</div>
				</div>
				<div style={{ display: "flex", gap: 20 }}>
					<div className="receipt-card receipt-card__due">
						<label htmlFor="">DUE IN</label>
						<span>{Math.abs(days) || Math.abs(hours)}</span>
						<span>
							{Math.abs(days) ? `days${days < 0 ? " ago" : ""}` : `hours${hours < 0 ? " ago" : ""}`}
						</span>
					</div>
					<div className="receipt-card receipt-card__addtl">
						<div className="form-group">
							<label htmlFor="">PLAN</label>
							<span>
								{`${receipt.planRef.name}`} <b>PHP{`${receipt.planRef.price}`}</b>
							</span>
						</div>
						<div className="form-group">
							<label htmlFor="">REF NUMBER</label>
							<span>{`${receipt.referenceNumber}`}</span>
						</div>
						<div className="form-group">
							<label htmlFor="">DUE FOR</label>
							<span>{DateTime.fromISO(receipt.receiptDate).toFormat("LLLL dd, yyyy")}</span>
						</div>
					</div>
				</div>
			</Card>
			<footer>
				{receipt.status === RECEIPT_STATUS.PENDING ? (
					<>
						<button
							className={`invalid invisible`}
							onClick={() =>
								props.showConfirmModal({
									data: receipt,
									action: "DENIED",
								})
							}
						>
							<IconInvalid />
							<label>INVALID</label>
						</button>
						<button
							className={`success invisible`}
							onClick={() =>
								props.showConfirmModal({
									data: receipt,
									action: "ACCEPTED",
								})
							}
						>
							<IconAccept />
							<label>ACCEPT</label>
						</button>
					</>
				) : (
					<button
						style={{ width: "170px" }}
						className={`bg-info invisible text-white fill-white`}
						onClick={() =>
							props.showConfirmModal({
								data: receipt,
								action: "PENDING",
							})
						}
					>
						<IconReplace />
						<label>CHANGE STATUS</label>
					</button>
				)}
			</footer>
		</div>
	);
};

export default ReceiptCard;
