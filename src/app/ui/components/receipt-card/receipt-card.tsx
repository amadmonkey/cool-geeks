import React, { useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import Image from "next/image";
import { CONSTANTS, CUTOFF_TYPE, getDaysLeft, RECEIPT_STATUS } from "@/utility";

// components
import Card from "@/app/ui/components/card/card";

// types
import Receipt from "../../types/Receipt";

// svgs
import IconBack from "@/public/back.svg";
import IconAccept from "@/public/done.svg";
import IconMid from "@/public/midmonth.svg";
import IconInvalid from "@/public/invalid.svg";
import IconLoading from "@/public/loading.svg";
import IconEnd from "@/public/end-of-month.svg";
import ConfirmModal from "../confirm-modal/confirm-modal";

interface Props {
	data: Receipt;
	updateConfirmTemplate: any;
}

const ReceiptCard = (props: Props) => {
	const signal = useRef<any>();
	const controller = useRef<any>();
	const [receipt, setReceipt] = useState(props.data);
	const [rejectReason, setRejectReason] = useState("");
	const [loading, setLoading] = useState<boolean>(false);
	const [receiptUrl, setReceiptUrl] = useState(CONSTANTS.imagePlaceholder);
	const { days, hours } = getDaysLeft(DateTime.fromISO(props.data.receiptDate));

	const getImage = async () => {
		try {
			// abort previous calls
			if (controller.current) controller.current.abort();
			controller.current = new AbortController();
			signal.current = controller.current.signal;

			const searchOptions = new URLSearchParams({
				id: receipt!.imageId,
				action: "/image",
			});

			const res = await fetch(`/api/receipt?${searchOptions}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				signal: signal.current,
			}).then((res) => res.json());

			setReceiptUrl(res.data);
		} catch (e: any) {
			if (e.name === "AbortError") return;
			console.log(e);
		}
	};

	const updateReceipt = async (props: any) => {
		try {
			setLoading(true);
			const { code, data } = await fetch("/api/receipt", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(props),
				credentials: "include",
			}).then((res) => res.json());
			switch (code) {
				case 200:
					// const updatedList = listRef.current.map((item: any) =>
					// 	item._id === data._id ? data : item
					// );
					// listRef.current = updatedList;
					setReceipt(data);
					break;
				case 400:
					// parse errors
					break;
				default:
					break;
			}
			setLoading(false);
		} catch (e) {
			setLoading(false);
			console.error(e);
		}
	};

	const handleUpdateStatus = (data: any) => {
		// showConfirmModal(data);
		updateReceipt(data);
		setLoading(true);
	};

	useEffect(() => {
		setReceipt(props.data);
		getImage();
		setLoading(false);
	}, [props.data]);

	return (
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
				return (
					<div key={props.data._id} className="receipt-card">
						{/* receiptUrl === CONSTANTS.imagePlaceholder */}
						<div
							className={`image-container ${
								receiptUrl === CONSTANTS.imagePlaceholder ? "loading skeleton" : ""
							}`}
							style={
								receiptUrl === CONSTANTS.imagePlaceholder
									? { justifyContent: "center", alignItems: "center" }
									: {}
							}
						>
							<Image
								alt={receipt.receiptName}
								height={0}
								width={0}
								placeholder="blur"
								blurDataURL={CONSTANTS.imagePlaceholder}
								onErrorCapture={(e: any) => {
									e.currentTarget.src = "/leaf.png";
									e.currentTarget.className = "error";
								}}
								src={receiptUrl}
								style={
									receiptUrl === CONSTANTS.imagePlaceholder
										? { height: "100px", width: "100px" }
										: {}
								}
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
										{Math.abs(days)
											? `days${days < 0 ? " ago" : ""}`
											: `hours${hours < 0 ? " ago" : ""}`}
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
						{loading ? (
							<footer>
								<IconLoading style={{ height: "10px" }} />
							</footer>
						) : (
							<footer>
								{receipt.status === RECEIPT_STATUS.PENDING ? (
									<>
										<button
											className={`invalid invisible`}
											onClick={() => {
												setLoading(true);
												showConfirmModal({ data: receipt, action: RECEIPT_STATUS.DENIED });
											}}
										>
											<IconInvalid />
											<label>INVALID</label>
										</button>
										<button
											className={`success invisible`}
											onClick={() => {
												setLoading(true);
												showConfirmModal({ data: receipt, action: RECEIPT_STATUS.ACCEPTED });
											}}
										>
											<IconAccept />
											<label>ACCEPT</label>
										</button>
									</>
								) : (
									<button
										className={`invisible`}
										onClick={() => {
											setLoading(true);
											showConfirmModal({ data: receipt, action: RECEIPT_STATUS.PENDING });
										}}
									>
										<IconBack />
										<label>REVERT STATUS</label>
									</button>
								)}
							</footer>
						)}
					</div>
				);
			}}
		</ConfirmModal>
	);
};

export default ReceiptCard;
