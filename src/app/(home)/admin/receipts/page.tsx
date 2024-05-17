"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GET_STATUS, GET_STATUS_BADGE, SKELETON_TYPES, TABLE_HEADERS, VIEW_MODES } from "@/utility";

import Image from "next/image";
import Card from "@/app/ui/components/card/card";
import Modal from "@/app/ui/components/modal/modal";
import Table from "@/app/ui/components/table/table";
import Switch from "@/app/ui/components/switch/switch";
import Button from "@/app/ui/components/button/button";
import FormGroup from "@/app/ui/components/form-group/form-group";
import ListEmpty from "@/app/ui/components/table/empty/list-empty";
import RadioGroup from "@/app/ui/components/radio-group/radio-group";
import Skeleton from "@/app/ui/components/skeleton/skeleton-table/skeleton-table";

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
	const [selectedPayment, setSelectedPayment] = useState<any>(null);
	const [list, setList] = useState<any>({});
	const [filteredList, setFilteredList] = useState<any>(null);
	const [viewMode, setViewMode] = useState(props.viewMode || VIEW_MODES.GRID);

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
				toUpdate: selectedPayment._id,
				newStatus: selectedPayment.accepted ? "ACCEPTED" : "DENIED",
			}),
			credentials: "include",
		}).then((res) => res.json());
		switch (code) {
			case 200:
				const updatedList = list.map((item: any) =>
					item._id === selectedPayment._id ? data : item
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
					<div className={`receipt-cards-container ${viewMode.toLowerCase()}`}>
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
						{filteredList === null
							? "skeleton"
							: filteredList
									.slice(0, viewMode === VIEW_MODES.GRID ? filteredList.length : 1)
									.map((item: any, i: number) => {
										const paymentDate = new Date(item.paymentDate);
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
												<Card>
													<div className="receipt-card__form-group">
														<label htmlFor="">USER</label>
														<span>{`${item.userRef.firstName} ${item.userRef.lastName}`}</span>
													</div>
													<div className="receipt-card__form-group">
														<label htmlFor="">SUBD</label>
														<span>{`${item.planRef.subdRef.name}`}</span>
													</div>
													<div className="receipt-card__form-group">
														<label htmlFor="">CUTOFF</label>
														<span>{`${item.cutoff}`}</span>
													</div>
													<div className="receipt-card__form-group">
														<label htmlFor="">PAYMENT DATE</label>
														<span>{`${paymentDate.toLocaleDateString("default", {
															month: "long",
														})} ${paymentDate.getFullYear()}`}</span>
													</div>
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
													<footer className={item.status.toLowerCase()}>
														{item.status === GET_STATUS.PENDING ? (
															<>
																<button
																	className="button-test danger invisible"
																	onClick={() => confirmUpdatePayment(item, false)}
																>
																	<IconDeny />
																	<label>REJECT</label>
																</button>
																<button
																	className="button-test success invisible"
																	onClick={() => confirmUpdatePayment(item, true)}
																>
																	<IconAccept />
																	<label>ACCEPT</label>
																</button>
															</>
														) : item.status === GET_STATUS.ACCEPTED ? (
															<IconAccept />
														) : (
															<IconDeny />
														)}
													</footer>
												</Card>
											</div>
										);
									})}
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
								const paymentDate = new Date(item.paymentDate);
								return (
									<tr key={index} className={`${item.status === "FAILED" ? "row-failed" : ""}`}>
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
											{`${paymentDate.toLocaleDateString("default", {
												month: "long",
											})} ${paymentDate.getFullYear()}`}
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
															alt="Picture of the author"
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
													{GET_STATUS_BADGE(item.status)}
												</td>
												{item.status === "PENDING" ? (
													<td>
														<label htmlFor="deny" className="sr-only">
															Deny
														</label>
														<button
															name="deny"
															className="invisible button__action"
															onClick={() => confirmUpdatePayment(item, false)}
														>
															<IconDeny />
														</button>
														<label htmlFor="deny" className="sr-only">
															Deny
														</label>
														<button
															name="accept"
															className="invisible button__action"
															onClick={() => confirmUpdatePayment(item, true)}
														>
															<span className="sr-only">Accept</span>
															<IconAccept />
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
							<ListEmpty></ListEmpty>
						)}
					</Table>
				);
		}
	};

	// const handleViewModeChange = (newViewMode:any) => {
	// 	setViewMode(newViewMode);
	// }

	useEffect(() => {
		mounted.current = true;
		getHistoryList();
		return () => {
			mounted.current = false;
		};
	}, []);

	return (
		<section
			style={{ ...props.style, ...{ display: "flex", flexDirection: "column", width: "100%" } }}
		>
			<header className="page-header">
				<h1
					className="section-title"
					style={{
						gap: "5px",
						display: "flex",
						marginBottom: "unset",
						alignItems: "center",
					}}
				>
					<IconReceipt />
					{props.title || "Receipts"}
				</h1>
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
			</header>
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
					{selectedPayment && (
						<>
							<h1 style={{ fontSize: "25px", marginBottom: "30px" }}>
								{selectedPayment.accepted ? "Accept" : "Deny"} this payment?
							</h1>
							{/* <div>
								<Switch
									style={{ transform: "scale(0.6)" }}
									label="Don't ask me again until next session"
								/>
							</div> */}
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
									<Button type="button" className="info" onClick={updatePayment}>
										Confirm
									</Button>
								</FormGroup>
							</div>
						</>
					)}
				</Card>
			</Modal>
		</section>
	);
}
