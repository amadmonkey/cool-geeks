"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import {
	DATE_READABLE,
	DEFAULT_VALUES,
	SKELETON_TYPES,
	STRING_UTILS,
	UI_TYPE,
	VALID_IMG_TYPES,
} from "@/utility";

import Plan from "@/app/ui/types/Plan";
import Switch from "@/app/ui/components/switch/switch";
import Button from "@/app/ui/components/button/button";
import Skeleton from "@/app/ui/components/skeleton/skeleton";
import TextInput from "@/app/ui/components/text-input/text-input";
import ListEmpty from "@/app/ui/components/table/empty/list-empty";
import HoverBubble from "@/app/ui/components/hover-bubble/hover-bubble";
import ConfirmModal from "@/app/ui/components/confirm-modal/confirm-modal";
import InlineEditInput from "@/app/ui/components/inline-edit-input/inline-edit-input";

import IconMore from "../../../../../../public/more.svg";
import IconHelp from "../../../../../../public/help.svg";
import IconAccepted from "../../../../../../public/done.svg";
import IconInvalid from "../../../../../../public/invalid.svg";
import IconReplace from "../../../../../../public/replace.svg";
import IconTrash from "../../../../../../public/trash2.svg";

import "./page.scss";

const Subd = (props: any) => {
	const { push } = useRouter();
	const mounted = useRef(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const [subd, setSubd] = useState<any>(null);
	const [plans, setPlans] = useState<Plan[]>([]);
	const [users, setUsers] = useState<any>({});
	const [file, setFile] = useState<File | null>(null);
	const [subdForm, setSubdForm] = useState<any>(null);
	const [planForm, setPlanForm] = useState<any>([]);
	const [newPlanForm, setNewPlanForm] = useState(DEFAULT_VALUES.planForm);
	const [planFormVisible, setPlanFormVisible] = useState<boolean>(false);
	const [planError, setPlanError] = useState("");
	const activePlan = useSearchParams().get("plan") || "";

	const currentPathname = usePathname();

	const getSubd = useCallback(() => {
		const searchOptions =
			props.searchOptions ||
			new URLSearchParams({
				filter: JSON.stringify({
					name: STRING_UTILS.DASH_TO_SPACE(props.params.subd),
				}),
				page: "1",
				limit: "1",
				sort: JSON.stringify({
					name: "asc",
					code: "asc",
				}),
			});
		fetch(`/api/subd?${searchOptions}`, {
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
							if (data[0]) {
								setSubd(data[0]);
								setSubdForm({
									name: data[0].name,
									code: data[0].code,
									number: data[0].gcash.number,
								});
								getImage(data[0]);
							} else {
								push("/admin/subds");
							}
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

	const addPlan = async () => {
		try {
			const { code, data } = await fetch("/api/plan", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...newPlanForm, ...{ subdRef: subd._id } }),
				credentials: "include",
			}).then((res) => res.json());
			switch (code) {
				case 200:
					setPlans((prev: any) => [...prev, data]);
					setPlanForm((prev: any) => [...prev, data]);
					setPlanFormVisible(false);
					// push(`/admin/subds/${STRING_UTILS.SPACE_TO_DASH(data.name.toLowerCase())}?new=true`);
					toast.success("Plan added successfully.");
					break;
				case 400:
					break;
				default:
					break;
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handleSubdUpdate = async (e: any) => {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append("_id", subd._id);
			formData.append("name", subdForm.name);
			formData.append("code", subdForm.code);
			formData.append("number", subdForm.number);
			formData.append("qr", file!);
			const { code, data } = await fetch("/api/subd", {
				method: "PUT",
				headers: {},
				body: formData,
				credentials: "include",
			}).then((res) => res.json());
			switch (code) {
				case 200:
					setSubd(data);
					push(`/admin/subds/${STRING_UTILS.SPACE_TO_DASH(data.name.toLowerCase())}?new=true`);
					toast.success("Subdivision updated successfully.");
					break;
				case 400:
					break;
				default:
					break;
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handlePlanUpdate = async (e: any, i: number) => {
		e && e.preventDefault();
		const { code, data } = await fetch("/api/plan", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(planForm[i]),
			credentials: "include",
		}).then((res) => res.json());
		switch (code) {
			case 200:
				getPlans();
				toast.success("Subdivision updated successfully.");
				break;
			case 400:
				console.log(data);
				toast.error("Something went wrong. Please try again.");
				break;
			default:
				break;
		}
	};

	const handlePlanDelete = async (e: any, i: number) => {
		e.preventDefault();
		console.log({ ...planForm[i], ...{ deleted: true } });
		const { code, data } = await fetch("/api/plan", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...planForm[i], ...{ deleted: true } }),
			credentials: "include",
		}).then((res) => res.json());
		switch (code) {
			case 200:
				getPlans();
				toast.success("Subdivision deleted successfully.");
				break;
			case 400:
				console.log(data);
				toast.error("Something went wrong. Please try again.");
				break;
			default:
				break;
		}
	};

	const updateSubdForm = (e: any) => {
		let { name, value } = e.target;
		setSubdForm((prev: any) => ({
			...prev,
			[name]: value,
		}));
	};

	const updatePlanForm = async (e: any, index: number) => {
		let { name, value } = e.target;
		const newPlanForm = planForm.map((plan: any, i: number) => {
			if (i === index) {
				return { ...plan, [name]: value };
			} else {
				return plan;
			}
		});
		setPlanForm(newPlanForm);
	};

	const updateNewPlanForm = (e: any) => {
		let { name, value } = e.target;
		setNewPlanForm((prev: any) => ({
			...prev,
			[name]: value,
		}));
	};

	const updateIsValid = (e: any) => {
		e.preventDefault();
		if (
			subdForm.name === subd.name &&
			subdForm.code === subd.code &&
			subdForm.number === subd.gcash.number
		)
			return false;
		return true;
	};

	const planIsValid = () => {
		if (!newPlanForm.name) {
			setPlanError("Please enter a valid plan name");
			return false;
		}
		if (!newPlanForm.price || isNaN(Number(newPlanForm.price))) {
			setPlanError("Please enter a valid price");
			return false;
		}
		return true;
	};

	const resetSubdForm = () =>
		setSubdForm({
			name: subd.name,
			code: subd.code,
			number: subd.gcash.number,
		});

	const getImage = async (subd: any) => {
		const url = `${process.env.NEXT_PUBLIC_API}/uploads/qr/${subd.gcash.qr.filename}`;
		return await fetch(url, {
			method: "GET",
		})
			.then((res) => res.blob())
			.then((blob) => {
				setFile(new File([blob], subd.gcash.qr.filename, { type: subd.gcash.qr.contentType }));
			})
			.catch((error) => console.error(error));
	};

	const getPlans = () => {
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
		fetch(`/api/plan?${searchOptions}`, {
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
							setPlanForm(data);
							if (activePlan) {
								const planObj = data.filter(
									(plan: any) => STRING_UTILS.SPACE_TO_DASH(plan.name) === activePlan
								)[0];
								planObj && getUsers(planObj._id);
							}
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

	const getUsers = async (id: any) => {
		try {
			const searchOptions = new URLSearchParams({
				filter: JSON.stringify({
					planRef: id,
				}),
				page: "1",
				limit: "10",
				sort: JSON.stringify({
					name: "asc",
					code: "asc",
				}),
			});
			const { code, data } = await fetch(`/api/user?${searchOptions}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			}).then((res) => res.json());

			switch (code) {
				case 200:
					console.log("users", data.list);
					setUsers((prev: any) => ({ ...prev, ...{ [id]: data.list } }));
					break;
				case 401:
					push("/login");
					break;
				default:
					push("/login");
					break;
			}
		} catch (e) {
			console.error(e);
		}
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
		subd && getPlans();
		return () => {
			mounted.current = false;
		};
	}, [subd]);

	useEffect(() => {
		mounted.current = true;
		if (activePlan && plans) {
			const planObj = plans.filter(
				(plan: any) => STRING_UTILS.SPACE_TO_DASH(plan.name) === activePlan
			)[0];
			planObj && getUsers(planObj._id);
			setPlanForm(plans);
		}
		return () => {
			mounted.current = false;
		};
	}, [activePlan]);

	return !subd ? (
		<Skeleton type={SKELETON_TYPES.SUBD} />
	) : (
		<div className="content__subd">
			<div className={`subd-container ${plans === null ? "loading" : ""}`}>
				<header>
					<div style={{ display: "flex", gap: "10px" }}>
						<InlineEditInput
							name="name"
							type="text"
							minLength="1"
							placeholder="Name"
							inputStyle={{ textAlign: "center" }}
							value={subdForm.name}
							onChange={updateSubdForm}
							onSubmit={handleSubdUpdate}
							action={resetSubdForm}
						>
							<h1>{subd.name}</h1>
						</InlineEditInput>
						<InlineEditInput
							name="code"
							type="text"
							minLength="1"
							maxLength="3"
							placeholder="Code"
							inputStyle={{ width: "150px", textAlign: "center", fontSize: "19px" }}
							value={subdForm.code}
							onChange={updateSubdForm}
							onSubmit={handleSubdUpdate}
							action={resetSubdForm}
						>
							<span className="code">({subd.code})</span>
						</InlineEditInput>
					</div>

					<InlineEditInput
						name="number"
						type="tel"
						minLength="12"
						maxLength="12"
						placeholder="Number"
						inputStyle={{ textAlign: "center" }}
						buttonStyle={{ height: "24px" }}
						value={subdForm.number}
						onChange={updateSubdForm}
						onSubmit={handleSubdUpdate}
						action={resetSubdForm}
					>
						<p tabIndex={0}>(+63) {subd.gcash.number}</p>
					</InlineEditInput>
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
					{/* <pre>{JSON.stringify(subdForm, null, 2)}</pre> */}
				</header>
				<div className="plans-container">
					<header>
						<h1>PLANS</h1>
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
								<>
									{plans.map((plan: Plan, i: number) => {
										return (
											<tbody
												key={plan._id}
												className={`plan-item${plan.active ? " active" : " inactive"}${
													STRING_UTILS.DASH_TO_SPACE(activePlan) === plan.name ? " selected" : ""
												}`}
											>
												<tr
													className="plan-item__row"
													tabIndex={0}
													onClick={(e: any) => {
														e.stopPropagation();
														push(
															STRING_UTILS.DASH_TO_SPACE(plan.name) ===
																STRING_UTILS.DASH_TO_SPACE(activePlan)
																? currentPathname
																: `${currentPathname}?${new URLSearchParams({
																		plan: STRING_UTILS.SPACE_TO_DASH(plan.name),
																  })}`
														);
													}}
												>
													<td tabIndex={0}>
														<InlineEditInput
															name="name"
															type="text"
															minLength="1"
															placeholder="Name"
															value={planForm[i].name}
															inputStyle={{ height: "23px" }}
															className="text-info"
															onChange={(e: any) => updatePlanForm(e, i)}
															onSubmit={(e: any) => handlePlanUpdate(e, i)}
														>
															{plan.name}
														</InlineEditInput>
													</td>
													<td tabIndex={0}>
														<InlineEditInput
															name="price"
															type="number"
															minLength="1"
															placeholder="Price"
															value={planForm[i].price}
															inputStyle={{ height: "23px" }}
															onChange={(e: any) => updatePlanForm(e, i)}
															onSubmit={(e: any) => handlePlanUpdate(e, i)}
														>
															₱{plan.price}
														</InlineEditInput>
													</td>
													<td>{DATE_READABLE(plan.updatedAt)}</td>
													{plan.active ? (
														<td className="success">
															<IconAccepted />
														</td>
													) : (
														<td className="invalid">
															<IconInvalid />
														</td>
													)}
												</tr>
												<tr className="plan-item__addtl">
													<td>
														<div className="plan-content-container">
															{STRING_UTILS.DASH_TO_SPACE(activePlan) === plan.name && (
																<>
																	<div className="plan-content">
																		<div className="plan-content__description">
																			<label htmlFor="plan-description">NOTES</label>
																			<form onSubmit={(e: any) => handlePlanUpdate(e, i)}>
																				<textarea
																					name="description"
																					id="description"
																					value={planForm[i].description}
																					onChange={(e: any) => updatePlanForm(e, i)}
																				/>
																				{plan.description !== planForm[i].description && (
																					<div
																						style={{
																							display: "flex",
																							justifyContent: "space-between",
																							gap: "10px",
																							marginTop: "10px",
																						}}
																					>
																						<Button
																							className="info"
																							type="submit"
																							style={{ height: "30px" }}
																						>
																							APPLY
																						</Button>
																					</div>
																				)}
																			</form>
																		</div>
																		<div className="plan-content__users">
																			<table>
																				<thead>
																					<tr>
																						<td>USER</td>
																						<td>SINCE</td>
																					</tr>
																				</thead>
																				{!users[plan._id] ? (
																					<tbody>
																						<tr>
																							<td>loading</td>
																						</tr>
																					</tbody>
																				) : users[plan._id].length ? (
																					<tbody>
																						{users === null
																							? "loading"
																							: users[plan._id].map((user: any) => {
																									return (
																										<>
																											<tr key={user._id}>
																												<td>
																													<Link
																														href={`/admin/accounts/${STRING_UTILS.SPACE_TO_DASH(
																															user.firstName.trim()
																														)}-${STRING_UTILS.SPACE_TO_DASH(
																															user.lastName.trim()
																														)}`}
																													>{`${user.firstName} ${user.lastName}`}</Link>
																												</td>
																												<td>{DATE_READABLE(subd.createdAt)}</td>
																											</tr>
																										</>
																									);
																							  })}
																					</tbody>
																				) : (
																					<tbody>
																						<tr
																							style={{
																								gridTemplateColumns: "100%",
																								margin: "20px",
																							}}
																						>
																							<td>
																								<ListEmpty style={{ minHeight: "100px" }} />
																							</td>
																						</tr>
																					</tbody>
																				)}
																			</table>
																		</div>
																	</div>
																	<footer>
																		<Switch
																			name={`plan-active-${plan._id}`}
																			id={`plan-active-${plan._id}`}
																			checked={plan.active}
																			onChange={(e: any) => togglePlanStatus(e, plan)}
																			value
																			confirmTemplate={() => planStatusTemplate(plan)}
																			label={
																				<span
																					style={{ fontSize: "14px" }}
																					className={plan.active ? "text-success" : "text-danger"}
																				>
																					{plan.active ? "ACTIVE" : "INACTIVE"}
																				</span>
																			}
																			mini
																		/>
																		<ConfirmModal
																			template={() => deleteConfirmTemplate(plan)}
																			continue={(e: any) => handlePlanDelete(e, i)}
																		>
																			{(showConfirmModal: any) => {
																				return (
																					<HoverBubble
																						style={{ display: "flex", gap: "3px" }}
																						message="Delete Plan"
																						type={UI_TYPE.danger}
																					>
																						<button className="delete" onClick={showConfirmModal}>
																							<IconTrash />
																						</button>
																					</HoverBubble>
																				);
																			}}
																		</ConfirmModal>
																	</footer>
																</>
															)}
														</div>
														<div className="see-more">
															<IconMore />
														</div>
														{/* <pre>{JSON.stringify(planForm[i], null, 2)}</pre> */}
													</td>
												</tr>
											</tbody>
										);
									})}
									{planFormVisible ? (
										<tbody className="plan-item">
											<tr className="plan-item__row">
												<td>
													<TextInput
														type="text"
														name="name"
														value={newPlanForm.name}
														minLength="2"
														onChange={updateNewPlanForm}
														placeholder="Name"
														noValidate
														line
													/>
												</td>
												<td>
													<TextInput
														type="number"
														name="price"
														value={newPlanForm.price}
														maxLength={5}
														onChange={updateNewPlanForm}
														placeholder="Rate"
														line
													/>
												</td>
												<td>
													<TextInput
														type="text"
														name="description"
														value={newPlanForm.description}
														minLength="2"
														onChange={updateNewPlanForm}
														placeholder="Notes"
														noValidate
														line
													/>
												</td>
												<td>
													<Button
														name="addPlan"
														type="button"
														style={{
															height: "30px",
															fontSize: "12px",
															letterSpacing: "0px",
															fontWeight: "800",
														}}
														onClick={() => planIsValid() && addPlan()}
													>
														<label htmlFor="addPlan" className="sr-only">
															ADD PLAN
														</label>
														ADD
													</Button>
												</td>
											</tr>
											{planError && (
												<tr style={{ gridTemplateColumns: "100%" }}>
													<td
														className="text-danger"
														style={{ fontWeight: 800, fontSize: "13px", marginTop: "10px" }}
													>
														{planError}
													</td>
												</tr>
											)}
										</tbody>
									) : (
										<Button
											type="button"
											className="primary"
											onClick={() => setPlanFormVisible(!planFormVisible)}
											style={{ width: "100px", letterSpacing: "0", alignSelf: "end" }}
											mini
										>
											ADD PLAN
										</Button>
									)}
								</>
							) : (
								<tbody>
									<tr
										style={{
											backgroundColor: "transparent",
											boxShadow: "none",
											gridTemplateColumns: "100%",
										}}
									>
										<td>
											<ListEmpty label="NO ENTRIES FOUND" />
										</td>
									</tr>
								</tbody>
							)
						) : (
							<>
								<tbody className="plan-item">
									<Skeleton type={SKELETON_TYPES.PLAN} />
								</tbody>
								<tbody className="plan-item">
									<Skeleton type={SKELETON_TYPES.PLAN} />
								</tbody>
								<tbody className="plan-item">
									<Skeleton type={SKELETON_TYPES.PLAN} />
								</tbody>
								<tbody className="plan-item">
									<Skeleton type={SKELETON_TYPES.PLAN} />
								</tbody>
								<tbody className="plan-item">
									<Skeleton type={SKELETON_TYPES.PLAN} />
								</tbody>
							</>
						)}
					</table>
				</div>
				{/* <pre>{JSON.stringify(subd, undefined, 2)}</pre> */}
			</div>
			<div className="qr-container">
				<Image
					alt="qr"
					ref={imageRef}
					height={0}
					width={0}
					unoptimized
					src={`${process.env.NEXT_PUBLIC_API}/uploads/qr/${subd.gcash.qr.filename}`}
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
				<button onClick={() => inputRef.current!.click()}>
					<IconReplace /> CHANGE
				</button>
			</div>
		</div>
	);
};

const deleteConfirmTemplate = (plan: any) => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<h1 style={{ marginBottom: "10px" }}>DELETING SUBDIVISION</h1>
			<p style={{ textAlign: "center", margin: "10px" }}>
				Deleting <strong>{plan.name}</strong>. This plan won&rsquo;t show anywhere in the app.
			</p>
			<p style={{ margin: "20px 0" }}>Continue?</p>
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
