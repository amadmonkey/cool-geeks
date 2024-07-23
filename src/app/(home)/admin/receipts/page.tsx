"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	RECEIPT_STATUS,
	RECEIPT_STATUS_BADGE,
	SKELETON_TYPES,
	TABLE_HEADERS,
	VIEW_MODES,
} from "@/utility";

import Image from "next/image";
import Receipt from "@/app/ui/types/Receipt";
import Table from "@/app/ui/components/table/table";
import Switch from "@/app/ui/components/switch/switch";
import Section from "@/app/ui/components/section/section";
import Skeleton from "@/app/ui/components/skeleton/skeleton";
import ReceiptCard from "@/app/ui/components/receipt-card/page";
import ListEmpty from "@/app/ui/components/table/empty/list-empty";
import RadioGroup from "@/app/ui/components/radio-group/radio-group";
import ConfirmModal from "@/app/ui/components/confirm-modal/confirm-modal";

import IconGrid from "../../../../../public/grid.svg";
import IconList from "../../../../../public/list.svg";
import IconDeny from "../../../../../public/denied.svg";
import IconAccept from "../../../../../public/done.svg";
import IconReceipt from "../../../../../public/receipt2.svg";
import IconCarousel from "../../../../../public/carousel.svg";

import "./page.scss";

export default function Receipts(props: any) {
	const { push } = useRouter();
	const mounted = useRef(false);
	const [list, setList] = useState<any>({});
	const [filteredList, setFilteredList] = useState<any>(null);
	const [viewMode, setViewMode] = useState(props.viewMode || VIEW_MODES.GRID);

	const updateReceipt = async (props: any) => {
		try {
			const { code, data } = await fetch("/api/receipt", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...props.data,
					...{ status: props.action },
				}),
				credentials: "include",
			}).then((res) => res.json());
			switch (code) {
				case 200:
					const updatedList = list.map((item: any) => (item._id === data._id ? data : item));
					setList(updatedList);
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

	const getHistoryList = useCallback(async () => {
		setList(null);
		setFilteredList(null);
		const searchOptions = new URLSearchParams({
			page: "1",
			limit: "10",
			sortBy: "createdAt",
			sortOrder: "DESC",
		});
		return await fetch(
			`${process.env.NEXT_PUBLIC_MID}/api/receipt?${props.searchOptions || searchOptions}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			}
		)
			.then((res) => res.json())
			.then((res) => {
				if (mounted.current) {
					const { code, data } = res;
					switch (code) {
						case 200:
							setList(data.list);
							setFilteredList(data.list);
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
			.catch((err) => console.error(err));
	}, [props.searchOptions, push]);

	const getView = (showConfirmModal: Function) => {
		switch (viewMode) {
			case VIEW_MODES.GRID:
			case VIEW_MODES.CAROUSEL:
				return (
					<div
						className={`receipt-cards-container ${viewMode.toLowerCase()}${
							filteredList === null ? " loading" : filteredList.length === 0 ? " empty" : ""
						}`}
					>
						{filteredList === null ? (
							<Skeleton type={SKELETON_TYPES.RECEIPT_CARD} />
						) : filteredList.length ? (
							filteredList
								.slice(0, viewMode === VIEW_MODES.GRID ? filteredList.length : 1)
								.map((item: any, i: number) => {
									console.log("RENDER", item);
									return (
										<ReceiptCard key={item._id} data={item} showConfirmModal={showConfirmModal} />
									);
								})
						) : (
							""
						)}
					</div>
				);
			case VIEW_MODES.LIST:
				return (
					<Table
						type="receipts"
						headers={TABLE_HEADERS.receipts}
						className={filteredList === null ? "loading" : ""}
					>
						{filteredList === null ? (
							<Skeleton type={SKELETON_TYPES.RECEIPTS} />
						) : filteredList.length ? (
							filteredList?.map((item: any) => {
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
		getHistoryList();
		return () => {
			mounted.current = false;
		};
	}, []);

	return (
		<Section title={sectionTitle(props.title)} others={sectionOthers(viewMode, setViewMode)}>
			<ConfirmModal template={updateConfirmTemplate} continue={updateReceipt}>
				{(showConfirmModal: any) => {
					return getView(showConfirmModal);
					// return (
					// 	<div
					// 		className={`receipt-cards-container ${viewMode.toLowerCase()}${
					// 			filteredList === null ? " loading" : filteredList.length === 0 ? " empty" : ""
					// 		}`}
					// 	>
					// 		{filteredList === null ? (
					// 			<Skeleton type={SKELETON_TYPES.RECEIPT_CARD} />
					// 		) : filteredList.length ? (
					// 			filteredList
					// 				.slice(0, viewMode === VIEW_MODES.GRID ? filteredList.length : 1)
					// 				.map((item: any, i: number) => {
					// 					console.log("RENDER", item);
					// 					return (
					// 						<ReceiptCard
					// 							key={item._id}
					// 							data={item}
					// 							showConfirmModal={(props: any) => {
					// 								setSelectedReceipt(props.data);
					// 								showConfirmModal(props);
					// 							}}
					// 						/>
					// 					);
					// 				})
					// 		) : (
					// 			""
					// 		)}
					// 	</div>
					// );
				}}
			</ConfirmModal>
			{/* <pre>
				{list &&
					list.length &&
					JSON.stringify(
						list.map((item: any) => item.status),
						undefined,
						2
					)}
			</pre> */}
			{props.title && (
				<Link
					href="/admin/receipts"
					style={{ letterSpacing: 5, fontSize: 11, textAlign: "center" }}
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

const updateConfirmTemplate = (props: updateReceiptTemplateProps) => {
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
				case VIEW_MODES.CAROUSEL:
					return {
						name: VIEW_MODES.CAROUSEL,
						label: <IconCarousel style={{ height: 30, width: "auto" }} />,
					};
			}
		})}
		selected={viewMode}
		onChange={(newValue: any) => setViewMode(newValue)}
	/>
);
