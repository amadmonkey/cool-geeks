"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import Card from "@/app/ui/components/card/card";
import Button from "@/app/ui/components/button/button";

import IconReceipt from "../../../../public/receipt.svg";
import IconOverdue from "../../../../public/overdue.svg";
import IconPending from "../../../../public/pending.svg";
import IconAddUser from "../../../../public/add-user.svg";

import "./page.scss";
import Receipts from "./receipts/page";

const Admin = () => {
	const { push } = useRouter();
	const [modalIsShown, setModalIsShown] = useState(false);
	const [selectedPayment, setSelectedPayment] = useState<any>(null);
	const [list, setList] = useState<any>({});
	const [filteredList, setFilteredList] = useState<any>(null);

	const getHistoryList = async () => {
		const searchOptions = new URLSearchParams({
			page: "1",
			limit: "5",
			sortBy: "createdAt",
			sortOrder: "DESC",
		});
		return await fetch(`${process.env.NEXT_PUBLIC_MID}/api/receipt?${searchOptions}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		}).then((res) => res.json());
	};

	const confirmUpdatePayment = (item: any, accepted: boolean) => {
		setSelectedPayment({ ...item, ...{ accepted } });
		setModalIsShown(true);
	};

	const updatePayment = async () => {
		const { code, data } = await fetch("/api/receipt", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: selectedPayment._id,
				newStatus: selectedPayment.accepted ? "ACCEPTED" : "DENIED",
			}),
			credentials: "include",
		}).then((res) => res.json());

		const updatedList = list.map((item: any) => (item._id === selectedPayment._id ? data : item));
		setList(updatedList);
		setFilteredList(updatedList);
		setModalIsShown(false);
	};

	useEffect(() => {
		let mounted = true;
		getHistoryList()
			.then((res) => {
				if (mounted) {
					const { code, data } = res;
					const { list, users, plans } = data;
					switch (code) {
						case 200:
							setList(list);
							setFilteredList(list);
							break;
						case 401:
							push("/login");
							break;
						default:
							console.log("getHistoryList default", data);
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
		<div className="content content__admin" style={{ flexDirection: "column" }}>
			<section>
				<Card>
					<Link href="/">
						<IconReceipt />
						<div>
							<h1 style={{ fontSize: "40px", lineHeight: "40px", fontWeight: "400" }}>2</h1>
							<h3 style={{ fontSize: "13px", fontWeight: "800" }}>Pending receipts</h3>
						</div>
					</Link>
				</Card>
				<Card>
					<Link href="/">
						<IconOverdue />
						<div>
							<h1 style={{ fontSize: "40px", lineHeight: "40px", fontWeight: "400" }}>6</h1>
							<h3 style={{ fontSize: "13px", fontWeight: "800" }}>Overdue accounts</h3>
						</div>
					</Link>
				</Card>
				<Card>
					<Link href="/">
						<IconPending style={{ stroke: "unset" }} />
						<div>
							<h1 style={{ fontSize: "40px", lineHeight: "40px", fontWeight: "400" }}>0</h1>
							<h3 style={{ fontSize: "13px", fontWeight: "800" }}>Pending accounts</h3>
						</div>
					</Link>
				</Card>
				<Link
					href="/admin/accounts/create"
					className="cg-button info"
					style={{ height: "unset", gap: "10px", alignItems: "center" }}
				>
					<IconAddUser style={{ display: "block", height: "50px", width: "50px" }} />
					<span style={{ width: "120px" }}>Add new account</span>
				</Link>
			</section>
			<Receipts
				title={"Recent Receipts"}
				searchOptions={
					new URLSearchParams({
						page: "1",
						limit: "5",
						sortBy: "createdAt",
						sortOrder: "DESC",
					})
				}
			/>
		</div>
	);
};

export default Admin;
