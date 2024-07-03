"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

import Table from "@/app/ui/components/table/table";
import Switch from "@/app/ui/components/switch/switch";
import Skeleton from "@/app/ui/components/skeleton/skeleton";
import ListEmpty from "@/app/ui/components/table/empty/list-empty";

import { DATE_READABLE, SKELETON_TYPES, TABLE_HEADERS } from "@/utility";

import IconAccounts from "../../../../../public/users.svg";
import IconAddUser from "../../../../../public/add-user.svg";
import "./page.scss";
import { Filter } from "@/app/ui/classes/filter";
import Section from "@/app/ui/components/section/section";

export default function Accounts(props: any) {
	const { push } = useRouter();
	const mounted = useRef(false);
	const filter = new Filter();
	const [list, setList] = useState<any>({});
	const [filteredList, setFilteredList] = useState<any>(null);

	const getAccounts = useCallback(() => {
		const searchOptions = new URLSearchParams(filter.values);
		return fetch(`${process.env.NEXT_PUBLIC_MID}/api/user?${searchOptions}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})
			.then((res) => res.json())
			.then((res) => {
				if (mounted) {
					const { code, data } = res;
					const { list } = data;
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
	}, [push]);

	const toggleUserStatus = async (e: any, user: any) => {
		e && e.preventDefault();
		try {
			const { code, data } = await fetch("/api/user", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ ...user, ...{ active: !user.active } }),
			}).then((res) => res.json());
			switch (code) {
				case 200:
					toast.success("Account updated successfully.");
					break;
				case 400:
					break;
				default:
					break;
			}
		} catch (e) {
			console.error("toggleUserStatus catch", e);
		}
	};

	const toggleUserStatusTemplate = (user: any) => {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				{user.active ? (
					<>
						<h1 style={{ marginBottom: "10px" }}>Deactivating Account</h1>
						<p>asdasdasdasd</p>
					</>
				) : (
					<>
						<h1 style={{ marginBottom: "10px" }}>Activating Account</h1>
						<p>asdasdasdasd</p>
					</>
				)}
				<p style={{ margin: "20px 0" }}>Continue?</p>
			</div>
		);
	};

	useEffect(() => {
		mounted.current = true;
		getAccounts();
		return () => {
			mounted.current = false;
		};
	}, []);

	return (
		<Section title={sectionTitle(props.title)} others={sectionOthers()}>
			<Table
				type="accounts"
				headers={TABLE_HEADERS.accounts}
				className={filteredList === null ? "loading" : ""}
			>
				{filteredList === null ? (
					<Skeleton type={SKELETON_TYPES.ACCOUNTS} />
				) : filteredList.length ? (
					filteredList?.map((user: any, index: number) => {
						let isActive = false;
						return (
							<tr
								key={index}
								className={`accounts ${!user.status ? "inactive" : ""}`}
								onMouseEnter={() => (isActive = true)}
							>
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
											<span style={{ color: "red" }}>({user.subdRef.code})</span>&nbsp;
											{`${user.subdRef.name}`}
											<br />
											{user.subdRef.gcash.number}
										</>
									) : (
										"N/A"
									)}
								</td>
								<td>{DATE_READABLE(user.createdAt)}</td>
								<td>{DATE_READABLE(user.updatedAt)}</td>
								<td className={`account-options ${isActive ? "active" : ""}`}>{isActive}</td>
								<td>
									<Switch
										name="active"
										id={user._id}
										checked={user.active}
										onChange={(e: any) => toggleUserStatus(e, user)}
										noLabel
										confirmTemplate={() => toggleUserStatusTemplate(user)}
									/>
								</td>
							</tr>
						);
					})
				) : (
					<ListEmpty></ListEmpty>
				)}
			</Table>
		</Section>
		// <section style={{ display: "flex", flexDirection: "column", width: "100%" }}>
		// 	<header className="page-header">
		// 		<h1
		// 			className="section-title"
		// 			style={{
		// 				display: "flex",
		// 				marginBottom: "unset",
		// 				gap: "5px",
		// 				alignItems: "center",
		// 			}}
		// 		></h1>
		// 		<div>
		// 			<Link href="/admin/accounts/create" className="has-icon outline">
		// 				<IconAddUser style={{ height: "25px", width: "auto" }} />
		// 				<span style={{ fontSize: "16px" }}>CREATE NEW ACCOUNT</span>
		// 			</Link>
		// 		</div>
		// 	</header>
		// </section>
	);
}

const sectionTitle = (title: string) => (
	<>
		<IconAccounts />
		{title || "Accounts"}
	</>
);
const sectionOthers = () => (
	<div>
		<Link href="/admin/accounts/create" className="has-icon outline">
			<IconAddUser style={{ height: "25px", width: "auto" }} />
			<span style={{ fontSize: "16px" }}>CREATE NEW ACCOUNT</span>
		</Link>
	</div>
);
