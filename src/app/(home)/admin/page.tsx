"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RECEIPT_STATUS, VIEW_MODES } from "@/utility";
import Link from "next/link";

// components
import Card from "@/app/ui/components/card/card";

// svgs
import IconReceipt from "@/public/receipt.svg";
import IconOverdue from "@/public/overdue.svg";
import IconPending from "@/public/pending.svg";
import IconAddUser from "@/public/add-user.svg";

// pages
import Receipts from "./receipts/page";
import Accounts from "./accounts/page";

// styles
import "./page.scss";

const Admin = () => {
	const { push } = useRouter();

	const [pendingUsers, setPendingUsers] = useState<number | null>(null);
	const [pendingReceipts, setPendingReceipts] = useState<number | null>(null);
	const [overdueAccounts, setOverdueAccounts] = useState<number | null>(null);

	const getAddtl = async () => {
		try {
			const searchOptions = new URLSearchParams({
				action: "/dashboard-info",
			});
			const { code, data } = await fetch(`/api/user?${searchOptions}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			}).then((res) => res.json());
			console.log(data);
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
		} catch (err) {
			console.log("getAddtl catch", err);
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
							<h1 className={`widget-header${pendingReceipts === null ? " skeleton" : ""}`}>
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
							<h1 className={`widget-header${overdueAccounts === null ? " skeleton" : ""}`}>
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
							<h1 className={`widget-header${pendingUsers === null ? " skeleton" : ""}`}>
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
