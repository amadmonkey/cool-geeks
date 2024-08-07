"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	VIEW_MODES,
	TABLE_HEADERS,
	RECEIPT_STATUS,
	SKELETON_TYPES,
	RECEIPT_STATUS_BADGE,
} from "@/utility";

import Image from "next/image";
import Receipt from "@/app/ui/types/Receipt";
import Table from "@/app/ui/components/table/table";
import Switch from "@/app/ui/components/switch/switch";
import Section from "@/app/ui/components/section/section";
import Skeleton from "@/app/ui/components/skeleton/skeleton";
import ReceiptCard from "@/app/ui/components/receipt-card/receipt-card";
import FormGroup from "@/app/ui/components/form-group/form-group";
import ListEmpty from "@/app/ui/components/table/empty/list-empty";
import RadioGroup from "@/app/ui/components/radio-group/radio-group";
import ConfirmModal from "@/app/ui/components/confirm-modal/confirm-modal";
import ReceiptsFilters from "./filters/filters";

import IconGrid from "../../../../../public/grid.svg";
import IconList from "../../../../../public/list.svg";
import IconDeny from "../../../../../public/denied.svg";
import IconAccept from "../../../../../public/done.svg";
import IconReceipt from "../../../../../public/receipt2.svg";

import { Filters } from "@/app/ui/classes/filters";
import "./page.scss";

export default function Receipts(props: any) {
	const { push } = useRouter();
	const mounted = useRef(false);
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
	const signal = useRef<any>();
	const controller = useRef<any>();
	const listRef = useRef<any>(null);
	const [, setFilteredList] = useState<any>(null); // TODO: hacky shit. find another way. keep in mind
	const [viewMode, setViewMode] = useState(props.viewMode || VIEW_MODES.GRID);
	const [rejectReason, setRejectReason] = useState("");

	const updateReceipt = async (props: any) => {
		try {
			setRejectReason("");
			const { code, data } = await fetch("/api/receipt", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...props.data,
					...{ rejectReason: rejectReason },
					...{ status: props.action },
				}),
				credentials: "include",
			}).then((res) => res.json());
			switch (code) {
				case 200:
					const updatedList = listRef.current.map((item: any) =>
						item._id === data._id ? data : item
					);
					listRef.current = updatedList;
					setFilteredList(updatedList);
					break;
				case 400:
					// parse errors
					break;
				default:
					break;
			}
		} catch (e) {
			console.error(e);
		}
	};

	// let controller = new AbortController();
	const getHistoryList = useCallback(
		async (fromFilter?: boolean, query?: any) => {
			try {
				// reset list when something in the filter changed
				if (fromFilter) {
					listRef.current = [];
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
					`/api/receipt?${new URLSearchParams(filters.valuesString)}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
						signal: signal.current,
						credentials: "include",
					}
				).then((res) => res.json());
				switch (code) {
					case 200:
						if (mounted.current) {
							const { list, totalCount } = data;

							filters.addItemsCurrent(list.length);
							filters.setItemsTotal(totalCount);

							listRef.current = listRef.current ? [...listRef.current, ...list] : list;
							setFilteredList(list);
						}
						break;
					case 401:
						push("/login");
						break;
					default:
						console.log("getHistoryList default", data);
						push("/login");
						break;
				}
			} catch (e) {
				console.log(e);
			}
		},
		[filters, push]
	);

	let timeoutId = useRef<number>();

	const onScroll = useCallback(() => {
		const el = document.documentElement;

		clearTimeout(timeoutId.current);
		if (Number(filters.pagesCurrent) >= Number(filters.pagesTotal)) return;
		timeoutId.current = window.setTimeout(() => {
			if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
				filters.incrementPage();
				getHistoryList();
			}
		}, 300);
	}, [filters, getHistoryList]);

	const getView = (showConfirmModal: Function) => {
		switch (viewMode) {
			case VIEW_MODES.GRID:
				return (
					<div
						className={`receipt-cards-container ${viewMode.toLowerCase()}${
							listRef.current === null ? " loading" : listRef.current.length === 0 ? " empty" : ""
						}`}
					>
						{listRef.current === null ? (
							<Skeleton type={SKELETON_TYPES.RECEIPT_CARD} />
						) : listRef.current.length ? (
							listRef.current.slice(0, listRef.current.length).map((item: Receipt) => {
								return (
									<ReceiptCard key={item._id} data={item} showConfirmModal={showConfirmModal} />
								);
							})
						) : (
							<ListEmpty label="No entries found" />
						)}
						{!props.title && Number(filters.pagesCurrent) < Number(filters.pagesTotal) && (
							<Skeleton type={SKELETON_TYPES.RECEIPT_CARD} />
						)}
					</div>
				);
			case VIEW_MODES.LIST:
				return (
					<Table
						type="receipts"
						headers={TABLE_HEADERS.receipts}
						className={listRef.current === null ? "loading" : ""}
					>
						{listRef.current === null ? (
							<Skeleton type={SKELETON_TYPES.RECEIPTS} />
						) : listRef.current.length ? (
							listRef.current?.map((item: any) => {
								const receiptDate = new Date(item.receiptDate);
								return (
									<tr
										key={item._id}
										className={`receipts ${item.status === "FAILED" ? "row-failed" : ""}`}
									>
										<td>
											<span
												style={{
													color: item.status === "FAILED" ? "#e46d6d" : "#5576c7",
													fontSize: "15px",
													fontWeight: "800",
												}}
											>{`${item.userRef.firstName} ${item.userRef.lastName}`}</span>
											<br />
											<span style={{ fontSize: "13px" }}>{item.planRef.subdRef.name}</span>
											<br />
											{item.userRef.accountNumber}
										</td>
										<td>
											<span>{item.planRef.name}</span>
											<br />
											<span style={{ fontSize: "20px", fontWeight: "bold" }}>
												₱{item.planRef.price}
											</span>
										</td>
										<td>
											{item.cutoff === "MID" ? "Midmonth" : "End of Month"}
											<br />
											{`${receiptDate.toLocaleDateString("default", {
												month: "long",
											})} ${receiptDate.getFullYear()}`}
										</td>
										{item.status !== "FAILED" ? (
											<>
												<td>{new Date(item.createdAt).toDateString()}</td>
												<td>{item.referenceNumber}</td>
												<td>
													<button className="invisible">
														<Image
															src={`/image.svg`}
															height={0}
															width={0}
															style={{ height: "20px", width: "auto" }}
															sizes="100vw"
															alt="Image icon button"
														/>
													</button>
												</td>
												<td
													style={{
														display: "flex",
														justifyContent: "center",
														alignContent: "center",
													}}
												>
													{RECEIPT_STATUS_BADGE(item.status)}
												</td>
												{item.status === RECEIPT_STATUS.PENDING ? (
													<td>
														<label htmlFor="deny" className="sr-only">
															Deny
														</label>
														<button
															name="deny"
															className="invisible button__action"
															onClick={() => showConfirmModal({ data: item, action: "DENIED" })}
														>
															<IconDeny className="invalid" />
														</button>
														<label htmlFor="deny" className="sr-only">
															Deny
														</label>
														<button
															name="accept"
															className="invisible button__action"
															onClick={() => showConfirmModal({ data: item, action: "ACCEPTED" })}
														>
															<span className="sr-only">Accept</span>
															<IconAccept className="success" />
														</button>
													</td>
												) : (
													<td>&nbsp;</td>
												)}
											</>
										) : (
											<>
												<td
													style={{
														fontSize: "20px",
														fontWeight: "800",
														letterSpacing: "10px",
													}}
												>
													NO RECEIPT SUBMITTED
												</td>
												<td>
													<Switch
														name="edit"
														id={item._id}
														label={
															<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
																User Status
															</div>
														}
														onChange={() => console.log("change user status")}
														mini
													/>
												</td>
											</>
										)}
									</tr>
								);
							})
						) : (
							<ListEmpty label="No entries found" />
						)}
					</Table>
				);
		}
	};

	useEffect(() => {
		mounted.current = true;
		!props.title && window.addEventListener("scroll", onScroll);
		props.title && getHistoryList();
		return () => {
			mounted.current = false;
			!props.title && window.removeEventListener("scroll", onScroll);
		};
	}, []);

	return (
		<Section title={sectionTitle(props.title)} others={sectionOthers(viewMode, setViewMode)}>
			{!props.title && (
				<ReceiptsFilters
					filters={filters}
					handleFilter={getHistoryList}
					style={{ marginBottom: "10px" }}
				/>
			)}
			<ConfirmModal
				template={(props: any) => updateConfirmTemplate(props, rejectReason, setRejectReason)}
				continue={updateReceipt}
			>
				{(showConfirmModal: any) => {
					return getView(showConfirmModal);
				}}
			</ConfirmModal>
			{props.title && (
				<Link
					className="button"
					href="/admin/receipts"
					style={{ marginTop: "20px", letterSpacing: 5, fontSize: 11, textAlign: "center" }}
				>
					VIEW MORE
				</Link>
			)}
		</Section>
	);
}

const sectionTitle = (title: string) => (
	<>
		<IconReceipt />
		{title || "Receipts"}
	</>
);

interface updateReceiptTemplateProps {
	data: Object;
	action: string;
}

const updateConfirmTemplate = (
	props: updateReceiptTemplateProps,
	rejectReason: string,
	setRejectReason: Function
) => {
	return (
		props && (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				{props.action === RECEIPT_STATUS.PENDING ? (
					<>
						<h1 style={{ fontSize: "14px", marginBottom: "10px" }}>REMOVE STATUS</h1>
						<p style={{ fontSize: "14px", textAlign: "center", margin: "10px" }}>
							This will set this receipt`s status back to <strong>PENDING</strong>
						</p>
						<p style={{ fontSize: "14px", margin: "10px 0" }}>Continue?</p>
					</>
				) : (
					<>
						<h1 style={{ fontSize: "14px", marginBottom: "10px" }}>UPDATING RECEIPT STATUS</h1>

						<p style={{ fontSize: "14px", textAlign: "center", margin: "10px" }}>
							This will set the receipt`s status to{" "}
							<strong
								className={
									props.action === RECEIPT_STATUS.ACCEPTED ? "text-success" : "text-danger"
								}
							>
								{props.action}
							</strong>
						</p>
						{props.action === RECEIPT_STATUS.DENIED && (
							<FormGroup
								label={
									<span>
										Reason <span>(Optional)</span>
									</span>
								}
								style={{ width: "100%", margin: "20px" }}
							>
								<textarea
									onChange={(e: any) => setRejectReason(e.target.value)}
									value={rejectReason}
								/>
							</FormGroup>
						)}
						<p style={{ fontSize: "14px", margin: "10px 0" }}>Continue?</p>
					</>
				)}
			</div>
		)
	);
};

const sectionOthers = (viewMode: any, setViewMode: any) => (
	<RadioGroup
		list={Object.keys(VIEW_MODES).map((mode) => {
			switch (mode) {
				case VIEW_MODES.GRID:
					return {
						name: VIEW_MODES.GRID,
						label: <IconGrid style={{ height: 30, width: "auto" }} />,
					};
				case VIEW_MODES.LIST:
					return {
						name: VIEW_MODES.LIST,
						label: <IconList style={{ height: 30, width: "auto" }} />,
					};
				// case VIEW_MODES.CAROUSEL:
				// 	return {
				// 		name: VIEW_MODES.CAROUSEL,
				// 		label: <IconCarousel style={{ height: 27, width: "auto" }} />,
				// 	};
				default:
					console.error("MODE NOT FOUND");
					break;
			}
		})}
		selected={viewMode}
		onChange={(newValue: any) => setViewMode(newValue)}
	/>
);
