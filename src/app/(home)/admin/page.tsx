"use client";

import Link from "next/link";
import Card from "@/app/ui/components/card/card";
import { VIEW_MODES } from "@/utility";

import IconReceipt from "../../../../public/receipt.svg";
import IconOverdue from "../../../../public/overdue.svg";
import IconPending from "../../../../public/pending.svg";
import IconAddUser from "../../../../public/add-user.svg";

import Receipts from "./receipts/page";
import Accounts from "./accounts/page";
import Subds from "./subds/page";

import "./page.scss";

const Admin = () => {
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
						limit: "3",
						sortBy: "createdAt",
						sortOrder: "DESC",
					})
				}
				viewMode={VIEW_MODES.GRID}
				style={{ marginTop: 20 }}
			/>
			<Link
				href="/admin/receipts"
				style={{ letterSpacing: 5, fontSize: 11, textAlign: "center", margin: "20px 0" }}
			>
				VIEW MORE
			</Link>
			<Accounts
				title={"Recently Updated Accounts"}
				searchOptions={
					new URLSearchParams({
						page: "1",
						limit: "5",
						sortBy: "createdAt",
						sortOrder: "DESC",
					})
				}
			/>
			<Link
				href="/admin/accounts"
				style={{ letterSpacing: 5, fontSize: 11, textAlign: "center", margin: "20px 0" }}
			>
				VIEW MORE
			</Link>
		</div>
	);
};

export default Admin;
