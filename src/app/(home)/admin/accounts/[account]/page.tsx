"use client";
import { useParams } from "next/navigation";
import React, { use, useEffect, useRef, useState } from "react";

// components
import Receipt from "@/app/ui/types/Receipt";
import Section from "@/app/ui/components/section/section";
import ReceiptCard from "@/app/ui/components/receipt-card/receipt-card";
import HistoryTable from "@/app/ui/components/history-table/history-table";

// icons
import IconUser from "@/public/user.svg";

// styles
import "./page.scss";
import "../../receipts/page.scss";

export default function Account(props: any) {
	const params = useParams();
	const [account, setAccount] = useState(null);
	const [historyList, setHistoryList] = useState([]);

	useEffect(() => {
		getHistoryList();
	}, []);

	const getHistoryList = async () => {
		const searchOptions = new URLSearchParams({
			page: "1",
			limit: "10",
			sort: JSON.stringify({
				updatedAt: "desc",
			}),
		});
		const { code, data } = await fetch(`/api/receipt?${searchOptions}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		}).then((res) => res.json());
		console.log("code", code);
		console.log("data", data);
		// .then((res) => {
		switch (code) {
			case 200:
				setHistoryList(data.list);
				break;
			case 401:
				break;
			default:
				break;
		}
	};

	const getImageSignal = useRef<any>();
	const getImageController = useRef<any>();
	const getImage = async (id: string) => {
		getImageController.current = new AbortController();
		getImageSignal.current = getImageController.current.signal;
		const searchOptions = new URLSearchParams({
			id: id,
			action: "/image",
		});

		const res = await fetch(`/api/receipt?${searchOptions}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			signal: getImageSignal.current,
		}).then((res) => res.json());

		return res.data;
	};

	const sectionOthers = () => <></>;

	const sectionTitle = (title: string) => (
		<>
			<IconUser />
			{params.account || "Accounts"}
		</>
	);

	return (
		<div
			className={`account-container ${props.intercept ? "intercept" : ""}`}
			style={{ width: props.intercept ? "90vw" : "100%", maxWidth: "1500px" }}
		>
			<Section title={sectionTitle("asd")} others={sectionOthers()}>
				<div className="info">show info here</div>
				<div
					style={{
						display: "inline-grid",
						gridTemplateColumns: "3fr 2fr",
						columnGap: "30px",
						overflowY: "auto",
						overflowX: "hidden",
						height: "70vh",
					}}
				>
					<div>
						<h3 style={{ margin: "20px 0", letterSpacing: "5px" }}>PAYMENT HISTORY</h3>
						<div
							style={{
								gap: "30px",
								minHeight: "300px",
								maxHeight: "60vh",
								overflowY: "auto",
								overflowX: "hidden",
							}}
						>
							<HistoryTable
								list={[...historyList, ...historyList, ...historyList, ...historyList]}
								getImage={getImage}
							/>
						</div>
					</div>
					<div>
						<h3 style={{ margin: "20px 0", letterSpacing: "5px" }}>RECEIPTS</h3>
						<div
							style={{
								minHeight: "300px",
								maxHeight: "60vh",
								overflow: "auto",
								padding: "20px 50px",
							}}
						>
							<div className={`receipt-cards-container`}>
								{historyList.map((item: Receipt) => (
									<ReceiptCard key={item._id} data={item} updateConfirmTemplate={() => <></>} />
								))}
							</div>
						</div>
					</div>
				</div>
			</Section>
			{/* {JSON.stringify(historyList)} */}
		</div>
	);
}
