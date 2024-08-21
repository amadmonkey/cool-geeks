"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ACCOUNT_STATUS, DATE_READABLE, SKELETON_TYPES, TABLE_HEADERS } from "@/utility";

// components
import Table from "@/app/ui/components/table/table";
import Switch from "@/app/ui/components/switch/switch";
import Section from "@/app/ui/components/section/section";
import Skeleton from "@/app/ui/components/skeleton/skeleton";
import ListEmpty from "@/app/ui/components/table/empty/list-empty";
import AccountsFilters from "./filters/filters";

// types
import { Filters } from "@/app/ui/classes/filters";

// svgs
import IconAccounts from "@/public/users.svg";
import IconAddUser from "@/public/add-user.svg";

// styles
import "./page.scss";

export default function Accounts(props: any) {
	const { push } = useRouter();
	const signal = useRef<any>();
	const mounted = useRef(false);
	const controller = useRef<any>();
	const [list, setList] = useState<any>({});
	const [loading, setLoading] = useState<boolean>(false);
	const [filteredList, setFilteredList] = useState<any>(null);
	const [filters] = useState(
		new Filters(
			props.searchOptions || {
				page: "1",
				limit: "9",
				sort: {
					createdAt: "desc",
				},
			}
		)
	);

	const getAccounts = useCallback(
		async (fromFilter?: boolean, query?: any) => {
			try {
				setLoading(true);

				// reset list when something in the filter changed
				if (fromFilter) {
					filters.setPagesCurrent(1);
					filters.setItemsCurrent(0);
				}

				// if has db query, set it
				if (query) {
					filters.setQuery(query);
					filters.setSort({ createdAt: query.sortOrder });
				}

				// abort previous calls
				if (controller.current) controller.current.abort();
				controller.current = new AbortController();
				signal.current = controller.current.signal;

				const { code, data } = await fetch(
					`/api/user?${new URLSearchParams(filters.valuesString)}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
					}
				).then((res) => res.json());
				if (mounted) {
					switch (code) {
						case 200:
							const { list } = data;
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
			} catch (err) {
				console.error(err);
			}
		},
		[push]
	);

	const toggleUserStatus = async (e: any, user: any) => {
		e && e.preventDefault();
		try {
			const { code, data } = await fetch("/api/user", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					...user,
					...{
						status:
							user.status === ACCOUNT_STATUS.STANDARD
								? ACCOUNT_STATUS.DEACTIVATED
								: ACCOUNT_STATUS.STANDARD,
					},
				}),
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
				{user.status === ACCOUNT_STATUS.STANDARD ? (
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
			{!props.title && (
				<AccountsFilters
					filters={filters}
					handleFilter={getAccounts}
					style={{ marginBottom: "10px" }}
				/>
			)}
			<Table
				type="accounts"
				headers={TABLE_HEADERS.accounts}
				className={filteredList === null ? "loading" : ""}
			>
				{filteredList === null ? (
					<Skeleton type={SKELETON_TYPES.ACCOUNTS} />
				) : filteredList.length ? (
					filteredList?.map((user: any, index: number) => {
						return (
							<tr key={index} className={`accounts ${!user.status ? "inactive" : ""}`}>
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
											{user.subdRef.number}
										</>
									) : (
										"N/A"
									)}
								</td>
								{user.createdAt ? (
									<td>{DATE_READABLE(user.createdAt)}</td>
								) : (
									<td>
										<div className="skeleton" style={{ height: "100%" }}></div>
									</td>
								)}
								{user.updatedAt ? (
									<td>{DATE_READABLE(user.updatedAt)}</td>
								) : (
									<td>
										<div className="skeleton" style={{ height: "100%" }}></div>
									</td>
								)}
								<td className={`account-options${user.status ? " ACTIVE" : ""}`}>{user.status}</td>
								<td>
									<Switch
										name="active"
										id={user._id}
										checked={user.status === ACCOUNT_STATUS.STANDARD}
										onChange={(e: any) => toggleUserStatus(e, user)}
										confirmTemplate={() => toggleUserStatusTemplate(user)}
									/>
								</td>
							</tr>
						);
					})
				) : (
					<tr style={{ backgroundColor: "unset", boxShadow: "unset" }}>
						<td>
							<ListEmpty label="No entries found" />
						</td>
					</tr>
				)}
			</Table>
			{props.title && (
				<Link
					href="/admin/accounts"
					style={{ letterSpacing: 5, fontSize: 11, textAlign: "center", marginTop: "30px" }}
				>
					VIEW MORE
				</Link>
			)}
		</Section>
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
