"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import ListEmpty from "@/app/ui/components/table/empty/list-empty";
import Loading from "@/app/ui/components/table/loading/loading";
import Table from "@/app/ui/components/table/table";

import { TABLE_HEADERS } from "@/utility";

import IconAddUser from "../../../../../public/add-user.svg";
import IconAccounts from "../../../../../public/users.svg";

export default function Accounts() {
	const { push } = useRouter();
	const [list, setList] = useState<any>({});
	const [filteredList, setFilteredList] = useState<any>(null);

	const getAccounts = async () => {
		const searchOptions = new URLSearchParams({
			page: "1",
			limit: "10",
			sortBy: "createdAt",
			sortOrder: "DESC",
		});
		return await fetch(`http://localhost:3000/api/user?${searchOptions}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		}).then((res) => res.json());
	};

	useEffect(() => {
		let mounted = true;
		getAccounts()
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
							push("/login");
							break;
					}
				}
			})
			.catch((err) => console.error(err));
		return () => {
			mounted = false;
		};
	}, [push]);

	return (
		<section style={{ display: "flex", flexDirection: "column", width: "100%" }}>
			<div
				className="page-header"
				// style={{
				// 	display: "flex",
				// 	justifyContent: "space-between",
				// 	alignItems: "center",
				// 	marginBottom: "10px",
				// 	width: "100%",
				// }}
			>
				<h1
					className="section-title"
					style={{
						display: "flex",
						marginBottom: "unset",
						gap: "5px",
						alignItems: "center",
					}}
				>
					<IconAccounts
						style={{ height: "35px", width: "35px", fill: "#e39d69", marginLeft: "10px" }}
					/>
					Accounts
				</h1>
				<div>
					<Link href="/admin/accounts/create" className="has-icon outline">
						<IconAddUser style={{ height: "25px", width: "auto" }} />
						<span style={{ fontSize: "16px" }}>ADD USER</span>
					</Link>
				</div>
			</div>
			<Table className="accounts" headers={TABLE_HEADERS.accounts}>
				{filteredList === null ? (
					<Loading />
				) : filteredList.length ? (
					filteredList?.map((user: any, index: number) => {
						return (
							<tr key={index} className="accounts">
								<td>
									<span
										style={{
											color: user.status === "FAILED" ? "#e46d6d" : "#5576c7",
											fontSize: "15px",
											fontWeight: "800",
										}}
									>{`${user.firstName} ${user.lastName}`}</span>
									{user.subdRef && (
										<>
											<br />
											<span style={{ fontSize: "13px" }}>{user.subdRef.name}</span>
										</>
									)}
									<br />
									{user.accountNumber}
								</td>
								<td>{user.address}</td>
								<td>{user.contactNo}</td>
								<td>
									{user.planRef ? (
										<>
											{user.planRef.name}
											<br />
											{user.planRef.price}
										</>
									) : (
										"N/A"
									)}
								</td>
								<td>
									{user.subdRef ? (
										<>
											{`${user.subdRef.code} - ${user.subdRef.name}`}
											<br />
											{user.subdRef.gcash.number}
										</>
									) : (
										"N/A"
									)}
								</td>
								<td>{new Date(user.createdAt).toLocaleDateString()}</td>
								<td>{new Date(user.updatedAt).toLocaleDateString()}</td>
							</tr>
						);
					})
				) : (
					<ListEmpty></ListEmpty>
				)}
			</Table>
		</section>
	);
}
