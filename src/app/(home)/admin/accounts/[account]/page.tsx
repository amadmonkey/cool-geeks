"use client";
import { useParams, useRouter } from "next/navigation";
import React, { use, useEffect, useRef, useState } from "react";
import { SKELETON_TYPES } from "@/utility";
import { Filters } from "@/app/ui/classes/filters";

// components
import Receipt from "@/app/ui/types/Receipt";
import Section from "@/app/ui/components/section/section";
import Skeleton from "@/app/ui/components/skeleton/skeleton";
import FormGroup from "@/app/ui/components/form-group/form-group";
import ListEmpty from "@/app/ui/components/table/empty/list-empty";
import ReceiptCard from "@/app/ui/components/receipt-card/receipt-card";
import HistoryTable from "@/app/ui/components/history-table/history-table";

// types
import User from "@/app/ui/types/User";

// icons
import IconUser from "@/public/user.svg";

// styles
import "./page.scss";
import "../../receipts/page.scss";

export default function Account(props: any) {
	const params = useParams();
	const { push } = useRouter();
	const [account, setAccount] = useState<User>();
	const [historyList, setHistoryList] = useState<any>(null);
	const [receiptsList, setReceiptsList] = useState<any>(null);

	useEffect(() => {
		getHistoryList();
		getAccount();
	}, []);

	const getAccount = async () => {
		const { code, data } = await fetch(
			`/api/user?${new URLSearchParams(
				new Filters({ query: { accountNumber: params.account } }).valuesString
			)}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			}
		).then((res) => res.json());
		switch (code) {
			case 200:
				setAccount(data.list[0]);
				break;
			case 401:
				push("/login");
				break;
			default:
				push("/login");
				break;
		}
	};

	const getHistoryList = async (filters?: any) => {
		filters && filters.setInQuery({ accountNumber: params.account });
		if (!filters) return;

		const { code, data } = await fetch(
			`/api/receipt?${new URLSearchParams({ ...filters, history: "true" })}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			}
		).then((res) => res.json());
		switch (code) {
			case 200:
				const { list, totalCount } = data;
				if (filters) {
					filters.setItemsTotal(totalCount);
					filters.setItemsCurrent(list.length);
				}

				// currently same api call for both history and receipts.
				// receipts dont need failed status so removing them after fetch
				setHistoryList(list);
				setReceiptsList(
					list.filter((item: any) => {
						return item.status !== "FAILED";
					})
				);
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

	const sectionTitle = () => (
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
			<Section title={sectionTitle()} others={sectionOthers()}>
				{account && (
					<div className="info">
						<FormGroup row>
							<label>Name</label>
							<span>
								{account.firstName} {account.lastName}
							</span>
						</FormGroup>
						<FormGroup row>
							<label>Address</label>
							<span>{account.address}</span>
						</FormGroup>
						<FormGroup row>
							<label>Cutoff</label>
							<span>{account.cutoff}</span>
						</FormGroup>
						<FormGroup row>
							<label>Phone</label>
							<span>{account.contactNo}</span>
						</FormGroup>
						<FormGroup row>
							<label>Email</label>
							<span>{account.email}</span>
						</FormGroup>
						<FormGroup row>
							<label>Plan</label>
							<span>{account.planRef.name}</span>
						</FormGroup>
						<FormGroup row>
							<label>Subdivision</label>
							<span>{account.subdRef.name}</span>
						</FormGroup>
						<FormGroup row>
							<label>Created</label>
							<span>{account.createdAt}</span>
						</FormGroup>
						<FormGroup row>
							<label>Updated</label>
							<span>{account.updatedAt}</span>
						</FormGroup>
					</div>
				)}
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
								paddingRight: "30px",
							}}
						>
							<HistoryTable
								list={historyList}
								handleGetHistoryList={getHistoryList}
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
								{receiptsList ? (
									receiptsList.length ? (
										receiptsList.map((item: Receipt) => (
											<ReceiptCard key={item._id} data={item} updateConfirmTemplate={() => <></>} />
										))
									) : (
										<ListEmpty label="No entries found" />
									)
								) : (
									<Skeleton type={SKELETON_TYPES.RECEIPT_CARD} />
								)}
							</div>
						</div>
					</div>
				</div>
			</Section>
			{/* {JSON.stringify(historyList)} */}
		</div>
	);
}
