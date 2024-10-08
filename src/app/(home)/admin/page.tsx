"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RECEIPT_STATUS, VIEW_MODES } from "@/utility";

import Card from "@/app/ui/components/card/card";

import IconReceipt from "../../../../public/receipt.svg";
import IconOverdue from "../../../../public/overdue.svg";
import IconPending from "../../../../public/pending.svg";
import IconAddUser from "../../../../public/add-user.svg";

import Receipts from "./receipts/page";
import Accounts from "./accounts/page";

import "./page.scss";

const Admin = () => {
	const { push } = useRouter();

	const [pendingUsers, setPendingUsers] = useState<number | null>(null);
	const [pendingReceipts, setPendingReceipts] = useState<number | null>(null);
	const [overdueAccounts, setOverdueAccounts] = useState<number | null>(null);

	const getAddtl = async () => {
		const { code, data } = await fetch(`/api/user/dashboard`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		}).then((res) => res.json());
		switch (code) {
			case 200:
				setPendingUsers(data.pendingUsers);
				setPendingReceipts(data.pendingReceipts);
				setOverdueAccounts(data.overdueAccounts);
				break;
			case 401:
				push("/login");
				break;
			default:
				console.log("getHistoryList default", data);
				push("/login");
				break;
		}
	};

	useEffect(() => {
		getAddtl();
	}, []);

	return (
		<div className="content content__admin" style={{ flexDirection: "column", gap: "100px" }}>
			<section>
				<Card>
					<Link href="/">
						<IconReceipt />
						<div>
							<h1 style={{ fontSize: "40px", lineHeight: "40px", fontWeight: "400" }}>
								{pendingReceipts}
							</h1>
							<h3 style={{ fontSize: "13px", fontWeight: "800" }}>Pending receipts</h3>
						</div>
					</Link>
				</Card>
				<Card>
					<Link href="/">
						<IconOverdue />
						<div>
							<h1 style={{ fontSize: "40px", lineHeight: "40px", fontWeight: "400" }}>
								{overdueAccounts}
							</h1>
							<h3 style={{ fontSize: "13px", fontWeight: "800" }}>Overdue accounts</h3>
						</div>
					</Link>
				</Card>
				<Card>
					<Link href="/">
						<IconPending style={{ stroke: "unset" }} />
						<div>
							<h1 style={{ fontSize: "40px", lineHeight: "40px", fontWeight: "400" }}>
								{pendingUsers}
							</h1>
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
				searchOptions={{
					query: {
						status: RECEIPT_STATUS.PENDING,
					},
					page: "1",
					limit: "3",
					sort: {
						createdAt: "desc",
					},
				}}
				viewMode={VIEW_MODES.GRID}
				style={{ marginTop: 20 }}
			/>
			<Accounts
				title={"Recently Updated Accounts"}
				searchOptions={{
					page: "1",
					limit: "5",
					sort: JSON.stringify({ createdAt: "desc" }),
				}}
			/>
		</div>
	);
};

export default Admin;
