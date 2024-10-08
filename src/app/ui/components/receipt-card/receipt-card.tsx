import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DateTime } from "luxon";
import { CUTOFF_TYPE, getDaysLeft, RECEIPT_STATUS } from "@/utility";

import Card from "@/app/ui/components/card/card";

import Receipt from "../../types/Receipt";
import IconAccept from "../../../../../public/done.svg";
import IconMid from "../../../../../public/midmonth.svg";
import IconInvalid from "../../../../../public/invalid.svg";
import IconReplace from "../../../../../public/replace.svg";
import IconEnd from "../../../../../public/end-of-month.svg";

interface Props {
	data: Receipt;
	showConfirmModal: Function;
}

const ReceiptCard = (props: Props) => {
	const loaderImg = "/image-placeholder.png";
	const signal = useRef<any>();
	const controller = useRef<any>();
	const [receipt, setReceipt] = useState(props.data);
	const [receiptUrl, setReceiptUrl] = useState(loaderImg);
	const { days, hours } = getDaysLeft(DateTime.fromISO(props.data.receiptDate));

	const getImage = async () => {
		try {
			// abort previous calls
			if (controller.current) controller.current.abort();
			controller.current = new AbortController();
			signal.current = controller.current.signal;

			const searchOptions = new URLSearchParams({
				id: receipt!.gdriveId,
				action: "/image",
			});

			const res = await fetch(`/api/receipt?${searchOptions}`, {
				method: "GET",
				headers: {},
				credentials: "include",
				signal: signal.current,
			}).then((res) => res.blob());
			console.log(res);

			const urlCreator = window.URL || window.webkitURL;
			const imgUrl = urlCreator.createObjectURL(new Blob([res]));

			setReceiptUrl(imgUrl);
		} catch (e: any) {
			if (e.name === "AbortError") return;
			console.log(e);
		}
	};

	useEffect(() => {
		setReceipt(props.data);
		getImage();
	}, [props.data]);

	return (
		<div key={props.data._id} className="receipt-card">
			<div
				className={`image-container ${receiptUrl === loaderImg ? "loading skeleton" : ""}`}
				style={receiptUrl === loaderImg ? { justifyContent: "center", alignItems: "center" } : {}}
			>
				<Image
					alt={receipt.receiptName}
					height={0}
					width={0}
					placeholder="blur"
					blurDataURL={loaderImg}
					onErrorCapture={(e: any) => {
						e.currentTarget.src = "/leaf.png";
						e.currentTarget.className = "error";
					}}
					src={receiptUrl}
					style={receiptUrl === loaderImg ? { height: "100px", width: "100px" } : {}}
				/>
			</div>
			<Card className={`receipt-details ${receipt.status?.toLowerCase() || ""}`}>
				<div className="header">
					<span>{`${receipt.userRef.firstName} ${receipt.userRef.lastName}`}</span>
					<div style={{ display: "flex", gap: "5px" }}>
						{receipt.cutoff === CUTOFF_TYPE.MID ? <IconMid /> : <IconEnd />}
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
