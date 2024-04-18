"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/app/ui/components/button/button";
import Card from "@/app/ui/components/card/card";

import IconReceipt from "../../../../public/receipt.svg";
import IconOverdue from "../../../../public/overdue.svg";
import IconPending from "../../../../public/pending.svg";
import IconDeny from "../../../../public/denied.svg";
import IconAccept from "../../../../public/done.svg";
import IconLoading from "../../../../public/loading.svg";

import { GET_STATUS_BADGE } from "@/utility";
import "./page.scss";
import Modal from "@/app/ui/components/modal/modal";
import FormGroup from "@/app/ui/components/form-group/form-group";
import Switch from "@/app/ui/components/switch/switch";

const Admin = () => {
	const { push } = useRouter();
	const [modalIsShown, setModalIsShown] = useState(false);
	const [selectedPayment, setSelectedPayment] = useState<any>(null);
	const [list, setList] = useState<any>({});
	const [filteredList, setFilteredList] = useState<any>(null);

	const getHistoryList = async () => {
		const searchOptions = new URLSearchParams({
			page: "1",
			limit: "5",
			sortBy: "createdAt",
			sortOrder: "DESC",
		});
		return await fetch(`http://localhost:3000/api/payment?${searchOptions}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		}).then((res) => res.json());
	};

	const confirmUpdatePayment = (item: any, accepted: boolean) => {
		setSelectedPayment({ ...item, ...{ accepted } });
		setModalIsShown(true);
	};

	const updatePayment = async () => {
		const { code, data } = await fetch("/api/payment", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: selectedPayment._id,
				newStatus: selectedPayment.accepted ? "ACCEPTED" : "DENIED",
			}),
			credentials: "include",
		}).then((res) => res.json());

		const updatedList = list.map((item: any) => (item._id === selectedPayment._id ? data : item));
		setList(updatedList);
		setFilteredList(updatedList);
		setModalIsShown(false);
	};

	useEffect(() => {
		let mounted = true;
		getHistoryList()
			.then((res) => {
				if (mounted) {
					const { code, data } = res;
					const { list, users, plans } = data;
					switch (code) {
						case 200:
							console.log("list", list);
							console.log("users", users);
							console.log("plans", plans);
							setList(list);
							setFilteredList(list);
							break;
						case 401:
							push("/login");
							break;
						default:
							console.log("payment submit default", data);
							push("/login");
							break;
					}
				}
			})
			.catch((err) => console.log("getHistoryList catch", err));
		return () => {
			mounted = false;
		};
	}, [push]);

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
				<Button style={{ height: "inherit", borderRadius: "10px" }}>
					<Image
						src={`/new-user.svg`}
						height={0}
						width={0}
						style={{ height: "50px", width: "auto" }}
						sizes="100vw"
						alt="Picture of the author"
					/>
					<span>Add new account</span>
				</Button>
			</section>
			<section>
				<div
					className="filters"
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "10px",

						width: "100%",
					}}
				>
					<h1
						className="section-title"
						style={{
							marginBottom: "unset",
						}}
					>
						Recent Receipts
					</h1>
					<Link href="" style={{ letterSpacing: "5px" }}>
						SEE MORE
					</Link>
				</div>
				<div className="cg-table">
					<table>
						<thead>
							<tr>
								<th>USER</th>
								<th>PLAN</th>
								<th>CUTOFF DATE</th>
								<th>DATE SUBMITTED</th>
								<th>REF NUMBER</th>
								<th>RECEIPT</th>
								<th>STATUS</th>
								<th>&nbsp;</th>
							</tr>
						</thead>
						<tbody>
							{filteredList === null ? (
								<tr className="loading">
									<td colSpan={8}>
										<IconLoading />
									</td>
								</tr>
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
														<Switch />
														{/* <Button style={{ fontSize: "12px" }}>Deactivate account</Button> */}
													</td>
												</>
											)}
										</tr>
									);
								})
							) : (
								<div className="empty-container">
									<Image
										src={`/leaf.png`}
										height={0}
										width={0}
										style={{ height: "100px", width: "auto" }}
										sizes="100vw"
										alt="Picture of the author"
									/>
									<h1>NO ENTRIES</h1>
								</div>
							)}
						</tbody>
					</table>
				</div>
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
								<div>
									<Switch
										style={{ transform: "scale(0.6)" }}
										label="Don't ask me again until next session"
									/>
								</div>
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
		</div>
	);
};

export default Admin;
