"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
	CUTOFF_TYPE,
	RECEIPT_STATUS,
	RECEIPT_STATUS_BADGE,
	SKELETON_TYPES,
	TABLE_HEADERS,
	VIEW_MODES,
} from "@/utility";

import Image from "next/image";
import Card from "@/app/ui/components/card/card";
import Modal from "@/app/ui/components/modal/modal";
import Table from "@/app/ui/components/table/table";
import Switch from "@/app/ui/components/switch/switch";
import Button from "@/app/ui/components/button/button";
import Skeleton from "@/app/ui/components/skeleton/skeleton";
import FormGroup from "@/app/ui/components/form-group/form-group";
import ListEmpty from "@/app/ui/components/table/empty/list-empty";
import RadioGroup from "@/app/ui/components/radio-group/radio-group";
import Section from "@/app/ui/components/section/section";

import IconGrid from "../../../../../public/grid.svg";
import IconNext from "../../../../../public/next.svg";
import IconList from "../../../../../public/list.svg";
import IconDeny from "../../../../../public/denied.svg";
import IconAccept from "../../../../../public/done.svg";
import IconReceipt from "../../../../../public/receipt2.svg";
import IconCarousel from "../../../../../public/carousel.svg";
import IconPrevious from "../../../../../public/previous.svg";
import "./page.scss";

export default function Receipts(props: any) {
	const { push } = useRouter();
	const mounted = useRef(false);
	const [modalIsShown, setModalIsShown] = useState(false);
	const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
	const [list, setList] = useState<any>({});
	const [filteredList, setFilteredList] = useState<any>(null);
	const [viewMode, setViewMode] = useState(props.viewMode || VIEW_MODES.GRID);

	const confirmUpdateReceipt = (item: any, accepted: boolean) => {
		setSelectedReceipt({ ...item, ...{ accepted } });
		setModalIsShown(true);
	};

	const updateReceipt = async () => {
		const { code, data } = await fetch("/api/receipt", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				toUpdate: selectedReceipt._id,
				newStatus: selectedReceipt.accepted ? "ACCEPTED" : "DENIED",
			}),
			credentials: "include",
		}).then((res) => res.json());
		switch (code) {
			case 200:
				const updatedList = list.map((item: any) =>
					item._id === selectedReceipt._id ? data : item
				);
				setList(updatedList);
				setFilteredList(updatedList);
				break;
			case 400:
				// parse errors
				break;
			default:
				break;
		}
		setModalIsShown(false);
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

	const getView = () => {
		switch (viewMode) {
			case VIEW_MODES.GRID:
			case VIEW_MODES.CAROUSEL:
				return (
					<div
						className={`receipt-cards-container ${viewMode.toLowerCase()} ${
							filteredList === null ? "loading" : ""
						}`}
					>
						{viewMode === VIEW_MODES.CAROUSEL && (
							<button
								id="carousel-previous"
								name="carousel-previous"
								className="invisible nav nav__previous"
							>
								<IconPrevious />
								<label htmlFor="carousel-previous" className="sr-only">
									Previous
								</label>
							</button>
						)}
						{filteredList === null ? (
							<Skeleton type={SKELETON_TYPES.RECEIPT_CARD} />
						) : (
							filteredList
								.slice(0, viewMode === VIEW_MODES.GRID ? filteredList.length : 1)
								.map((item: any, i: number) => {
									const currentDate = new Date();
									const receiptDate = new Date(item.receiptDate);

									const _MS_PER_DAY = 1000 * 60 * 60 * 24;
									const utc1 = Date.UTC(
										currentDate.getFullYear(),
										currentDate.getMonth(),
										currentDate.getDate()
									);
									const utc2 = Date.UTC(
										receiptDate.getFullYear(),
										receiptDate.getMonth(),
										receiptDate.getDate()
									);

									const days = Math.floor((utc2 - utc1) / _MS_PER_DAY);

									return (
										<div key={i} className="receipt-card">
											<div className="image-container">
												<Image
													alt="qr"
													height={0}
													width={0}
													src={`${process.env.NEXT_PUBLIC_API}/receipts/${item.receiptName}`}
													unoptimized
												/>
											</div>
											<Card className={`receipt-details ${item.status?.toLowerCase() || ""}`}>
												<div className="header">
													<span>
														{`${item.userRef.firstName} ${item.userRef.lastName}`}
														{item.cutoff === CUTOFF_TYPE.MID ? (
															<Image
																src={`/midmonth.svg`}
																height={0}
																width={0}
																sizes="100vw"
																alt="MIDMONTH ICON"
															/>
														) : (
															<Image
																src={`/end-of-month.svg`}
																height={0}
																width={0}
																sizes="100vw"
																alt="END OF MONTH ICON"
															/>
														)}
													</span>
													<button className="invisible">...</button>
												</div>
												<div style={{ display: "flex", gap: 20 }}>
													<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
														<div className="receipt-card__form-group">
															<label htmlFor="">PLAN</label>
															<span>
																{`${item.planRef.name}`} <b>PHP{`${item.planRef.price}`}</b>
															</span>
														</div>
														<div className="receipt-card__form-group">
															<label htmlFor="">REF NUMBER</label>
															<span>{`${item.referenceNumber}`}</span>
														</div>
														<div className="receipt-card__form-group">
															<label htmlFor="">DUE FOR</label>
															{/* <span>{MONTH_NAMES[receiptDate.getMonth()]}</span> */}
															<span>{receiptDate.toDateString()}</span>
														</div>
													</div>
													<div
														className="receipt-card__form-group"
														style={{ alignItems: "center", gap: 0, justifyContent: "center" }}
													>
														<label htmlFor="">DUE IN</label>
														<span style={{ fontSize: 50, lineHeight: "50px" }}>
															{Math.abs(days)}
														</span>
														<span>{`days${days < 0 ? " ago" : ""}`}</span>
													</div>
												</div>
											</Card>
											{item.status === RECEIPT_STATUS.PENDING && (
												<footer>
													<button
														className="danger invisible"
														onClick={() => confirmUpdateReceipt(item, false)}
													>
														<IconDeny />
														<label>REJECT</label>
													</button>
													<button
														className="success invisible"
														onClick={() => confirmUpdateReceipt(item, true)}
													>
														<IconAccept />
														<label>ACCEPT</label>
													</button>
												</footer>
											)}
										</div>
									);
								})
						)}
						{viewMode === VIEW_MODES.CAROUSEL && (
							<button
								id="carousel-previous"
								name="carousel-previous"
								className="invisible nav nav__next"
							>
								<IconNext />
								<label htmlFor="carousel-previous" className="sr-only">
									Next
								</label>
							</button>
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
							filteredList?.map((item: any, index: number) => {
								const receiptDate = new Date(item.receiptDate);
								return (
									<tr
										key={index}
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
															onClick={() => confirmUpdateReceipt(item, false)}
														>
															<IconDeny className="danger" />
														</button>
														<label htmlFor="deny" className="sr-only">
															Deny
														</label>
														<button
															name="accept"
															className="invisible button__action"
															onClick={() => confirmUpdateReceipt(item, true)}
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
			{getView()}
			<Modal isShown={modalIsShown} close={() => setModalIsShown(false)}>
				<Card
					style={{
						width: "400px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					{selectedReceipt && (
						<>
							{selectedReceipt.accepted ? (
								<>
									<h1
										style={{
											fontSize: "15px",
											marginBottom: "30px",
											fontWeight: 800,
											letterSpacing: "5px",
										}}
									>
										ACCEPTING RECEIPT
									</h1>
									<p style={{ textAlign: "center" }}>
										Are you sure you want to accept this receipt from{" "}
										<span style={{ fontWeight: 800 }}>
											{`${selectedReceipt.userRef.firstName} ${selectedReceipt.userRef.lastName}`}
										</span>
										?
									</p>
								</>
							) : (
								<>
									<h1
										style={{
											fontSize: "15px",
											marginBottom: "30px",
											fontWeight: 800,
											letterSpacing: "5px",
										}}
									>
										REJECT RECEIPT
									</h1>
									<label
										htmlFor="reject-reason"
										style={{ fontWeight: 800, fontSize: "13px", alignSelf: "start" }}
									>
										Enter reason for rejection (Optional)
									</label>
									<textarea
										name="reject-reason"
										id="reject-reason"
										rows={5}
										style={{ resize: "none", padding: "5px 10px" }}
									></textarea>
								</>
							)}
							{/* <h1 style={{ fontSize: "25px", marginBottom: "30px" }}>
								{selectedReceipt.accepted ? "Accept" : "Deny"} this receipt?
							</h1> */}
							<div
								style={{
									display: "flex",
									width: "100%",
									justifyContent: "space-between",
									gap: "10px",
									marginTop: "10px",
								}}
							>
								<FormGroup style={{ width: "100%" }}>
									<Button type="button" onClick={() => setModalIsShown(false)}>
										Close
									</Button>
								</FormGroup>
								<FormGroup style={{ width: "100%" }}>
									<Button type="button" className="info" onClick={updateReceipt}>
										Confirm
									</Button>
								</FormGroup>
							</div>
						</>
					)}
					{/* <pre>{JSON.stringify(selectedReceipt, undefined, 2)}</pre> */}
				</Card>
			</Modal>
		</Section>
	);
}

const sectionTitle = (title: string) => (
	<>
		<IconReceipt />
		{title || "Receipts"}
	</>
);

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
