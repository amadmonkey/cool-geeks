"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { DATE_READABLE, SKELETON_TYPES, STRING_UTILS, UI_TYPE, VALID_IMG_TYPES } from "@/utility";

import Switch from "@/app/ui/components/switch/switch";
import HoverBubble from "@/app/ui/components/hover-bubble/hover-bubble";

import IconMore from "../../../../../../public/more.svg";
import IconAccepted from "../../../../../../public/done.svg";
import IconDenied from "../../../../../../public/denied.svg";
import IconInvalid from "../../../../../../public/invalid.svg";
import IconReplace from "../../../../../../public/replace.svg";
import IconHelp from "../../../../../../public/help.svg";

import "./page.scss";
import ListEmpty from "@/app/ui/components/table/empty/list-empty";
import Skeleton from "@/app/ui/components/skeleton/skeleton";

const Subd = (props: any) => {
	const { push } = useRouter();
	const mounted = useRef(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const [subd, setSubd] = useState<any>(null);
	const [plans, setPlans] = useState<any>(null);
	const [users, setUsers] = useState<any>([""]);
	const [file, setFile] = useState<File | null>(null);
	const activePlan = useSearchParams().get("plan") || "";

	const currentPathname = usePathname();

	const getSubd = useCallback(() => {
		const searchOptions =
			props.searchOptions ||
			new URLSearchParams({
				filter: JSON.stringify({
					name: STRING_UTILS.DASH_TO_SPACE(props.params.subd).toLocaleUpperCase(),
				}),
				page: "1",
				limit: "1",
				sort: JSON.stringify({
					name: "asc",
					code: "asc",
				}),
			});
		fetch(`${process.env.NEXT_PUBLIC_MID}/api/subd?${searchOptions}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})
			.then((res) => res.json())
			.then(async (res) => {
				if (mounted.current) {
					const { code, data } = res;
					switch (code) {
						case 200:
							setSubd(data[0]);
							break;
						case 401:
							push("/login");
							break;
						default:
							console.log("get subds default", data);
							push("/login");
							break;
					}
				}
			})
			.catch((err) => console.log("getSubds catch", err));
	}, [push]);

	const getPlan = () => {
		const searchOptions = new URLSearchParams({
			filter: JSON.stringify({
				subdRef: subd._id,
			}),
			page: "1",
			limit: "1",
			sort: JSON.stringify({
				name: "asc",
				code: "asc",
			}),
		});
		fetch(`${process.env.NEXT_PUBLIC_MID}/api/plan?${searchOptions}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})
			.then((res) => res.json())
			.then(async (res) => {
				if (mounted.current) {
					const { code, data } = res;
					switch (code) {
						case 200:
							setPlans(data);
							break;
						case 401:
							push("/login");
							break;
						default:
							console.log("get subds default", data);
							push("/login");
							break;
					}
				}
			})
			.catch((err) => console.log("getSubds catch", err));
	};

	const handleFileChange = async (subd: any, file: File) => {
		if (VALID_IMG_TYPES.includes(file.type)) {
			imageRef.current!.src = URL.createObjectURL(file);

			setFile(file);

			const formData = new FormData();
			subd._id && formData.append("_id", subd._id);
			formData.append("qr", file);
			formData.append("name", subd.name);
			formData.append("code", subd.code);
			formData.append("number", subd.gcash.number);

			const { code, data } = await fetch("/api/subd", {
				method: "PUT",
				headers: {},
				body: formData,
				credentials: "include",
			}).then((res) => res.json());

			switch (code) {
				case 200:
					getSubd();
					toast.success("Subdivision updated successfully.");
					break;
				case 400:
					break;
				default:
					break;
			}
		}
	};

	const togglePlanStatus = async (e: any, plan: any) => {
		e && e.preventDefault();
		try {
			const { code, data } = await fetch("/api/plan", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ ...plan, ...{ active: !plan.active } }),
			}).then((res) => res.json());
			switch (code) {
				case 200:
					getSubd();
					toast.success("Plan updated successfully.");
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

	useEffect(() => {
		mounted.current = true;
		getSubd();
		return () => {
			mounted.current = false;
		};
	}, []);

	useEffect(() => {
		mounted.current = true;
		subd && getPlan();
		return () => {
			mounted.current = false;
		};
	}, [subd]);

	return !subd ? (
		<Skeleton type={SKELETON_TYPES.SUBD} />
	) : (
		<div className={`content content__subd ${plans === null ? "loading" : ""}`}>
			<div className="subd-container">
				<header>
					<h1>
						{subd.name} <span className="danger">({subd.code})</span>
					</h1>
					<p>(+63) {subd.gcash?.number}</p>
					<div className="dates">
						<div>
							<label htmlFor="date-created">CREATED</label>
							<span id="date-created">{DATE_READABLE(subd.createdAt)}</span>
						</div>
						<div>
							<label htmlFor="date-created">UPDATED</label>
							<span id="date-created">{DATE_READABLE(subd.updatedAt)}</span>
						</div>
					</div>
				</header>
				<div className="plans-container">
					<header>
						<h1>PLANS</h1>
						{/* <TextInput mini /> */}
					</header>
					<table className="plan-table">
						<thead>
							<tr>
								<th>NAME</th>
								<th>RATE</th>
								<th>UPDATED</th>
								<th>
									<HoverBubble
										style={{ display: "flex", gap: "3px" }}
										message="Plan status states whether the plan will be selectable during account creation."
										type={UI_TYPE.info}
									>
										<IconHelp />
										STATUS
									</HoverBubble>
								</th>
							</tr>
						</thead>
						{plans !== null ? (
							plans.length ? (
								plans.map((plan: any) => {
									console.log(plan);
									return (
										<tbody
											key={plan._id}
											className={`${plan.active ? "active" : "inactive"} ${
												STRING_UTILS.DASH_TO_SPACE(activePlan) === plan.name ? "selected" : ""
											}`}
										>
											<tr
												onClick={() =>
													push(
														STRING_UTILS.DASH_TO_SPACE(plan.name) ===
															STRING_UTILS.DASH_TO_SPACE(activePlan)
															? currentPathname
															: `${currentPathname}?${new URLSearchParams({
																	plan: STRING_UTILS.SPACE_TO_DASH(plan.name),
															  })}`
													)
												}
											>
												<td>{plan.name}</td>
												<td>₱{plan.price}</td>
												<td>{DATE_READABLE(plan.updatedAt)}</td>
												{plan.active ? (
													<td className="success">
														<IconAccepted />
														{/* <span>ACTIVE</span> */}
													</td>
												) : (
													<td className="invalid">
														<IconInvalid />
														{/* <span>INACTIVE</span> */}
													</td>
												)}
											</tr>
											<tr>
												<td>
													<div className="plan-content">
														<div className="plan-content__description">
															<label htmlFor="plan-description">NOTES</label>
															<textarea
																name="plan-description"
																id="plan-description"
																defaultValue={plan.description || "No description"}
															/>
														</div>
														<div className="plan-content__users">
															<table>
																<thead>
																	<tr>
																		<td>USER</td>
																		<td>SINCE</td>
																	</tr>
																</thead>
																{users === null ? (
																	"loading"
																) : (
																	<tbody>
																		<tr>
																			<td>
																				<Link href="/admin/accounts/">Manny Villar</Link>
																			</td>
																			<td>July 19, 2021</td>
																		</tr>
																		<tr>
																			<td>
																				<Link href="/admin/accounts/">Nammy Rillav</Link>
																			</td>
																			<td>July 19, 2021</td>
																		</tr>
																	</tbody>
																)}
															</table>
														</div>
														<div className="plan-content__switch">
															<Switch
																name={`plan-active-${plan._id}`}
																id={`plan-active-${plan._id}`}
																checked={plan.active}
																onChange={(e: any) => togglePlanStatus(e, plan)}
																value
																confirmTemplate={() => planStatusTemplate(plan)}
																label={`THIS PLAN IS ${plan.active ? "ACTIVE" : "INACTIVE"}`}
																mini
															/>
														</div>
													</div>
													<div className="see-more">
														<IconMore />
													</div>
												</td>
											</tr>
											{/* <pre>{JSON.stringify(plan, null, 2)}</pre> */}
										</tbody>
									);
								})
							) : (
								<tbody>
									<tr>
										<td>
											<ListEmpty label="NO ENTRIES FOUND" />
										</td>
									</tr>
								</tbody>
							)
						) : (
							<>
								<tbody>
									<Skeleton type={SKELETON_TYPES.PLAN} />
								</tbody>
								<tbody>
									<Skeleton type={SKELETON_TYPES.PLAN} />
								</tbody>
								<tbody>
									<Skeleton type={SKELETON_TYPES.PLAN} />
								</tbody>
								<tbody>
									<Skeleton type={SKELETON_TYPES.PLAN} />
								</tbody>
								<tbody>
									<Skeleton type={SKELETON_TYPES.PLAN} />
								</tbody>
							</>
						)}
					</table>
				</div>
				{/* <pre>{JSON.stringify(plans, undefined, 2)}</pre> */}
			</div>
			<div className="qr-container">
				<Image
					alt="qr"
					ref={imageRef}
					height={0}
					width={0}
					unoptimized
					src={`${process.env.NEXT_PUBLIC_API}/qr/${subd.gcash.qr.filename}`}
					onClick={() => inputRef.current!.click()}
				/>
				<input
					name={props.name}
					ref={inputRef}
					type="file"
					accept=".png,.jpg,.jpeg,.pdf"
					onChange={(e: any) => handleFileChange(subd, e.currentTarget.files[0])}
					disabled={props.disabled}
				/>
				{/* <span className="hover-message">
						<IconReplace /> Change QR
					</span> */}
				<button onClick={() => inputRef.current!.click()}>
					<IconReplace /> Tap to change
				</button>
			</div>
		</div>
	);
};

const planStatusTemplate = (plan: any) => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			{plan.active ? (
				<>
					<h1 style={{ marginBottom: "10px" }}>Deactivating Plan</h1>
					<p style={{ textAlign: "center", margin: "10px" }}>
						Deactivating <strong>{plan.name}</strong>. This plan won&rsquo;t appear in account
						creation.
					</p>
				</>
			) : (
				<>
					<h1 style={{ marginBottom: "10px" }}>Activating Plan</h1>
					<p style={{ textAlign: "center", margin: "10px" }}>
						Deactivating <strong>{plan.name}</strong>. This plan start appearing in account
						creation.
					</p>
				</>
			)}
			<p style={{ margin: "20px 0" }}>Continue?</p>
		</div>
	);
};

export default Subd;
