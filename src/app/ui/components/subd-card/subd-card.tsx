import React, { useEffect, useState } from "react";
import Image from "next/image";
import Card from "@/app/ui/components/card/card";
import Table from "@/app/ui/components/table/table";
import Switch from "@/app/ui/components/switch/switch";
import ConfirmModal from "../confirm-modal/confirm-modal";
import FormGroup from "../form-group/form-group";
import TextInput from "../text-input/text-input";
import FileInput from "../file-input/file-input";
import Button from "../button/button";

import IconTrash from "../../../../../public/trash.svg";
import IconAdd from "../../../../../public/add.svg";
import IconRemove from "../../../../../public/denied.svg";
import IconEdit from "../../../../../public/edit.svg";

import { DEFAULT_VALUES, TABLE_HEADERS } from "@/utility";
import "./subd-card.scss";

const SubdCard = (props: any) => {
	const { subd } = props;
	const [plans, setPlans]: any = useState(subd?.plans || []);
	const [isHeaderShown, setIsHeaderShown] = useState(false);
	const [isEditMode, setIsEditMode] = useState(props.isCreating || false);
	const [form, setForm] = useState(subd || DEFAULT_VALUES.subdForm);
	const [planForm, setPlanForm] = useState(DEFAULT_VALUES.planForm);
	const [generalError, setGeneralError] = useState("");

	const updateForm = (e: any, plan?: Boolean) => {
		let { name, value } = e.target;
		plan
			? setPlanForm((prev: any) => ({ ...prev, [name]: value.toUpperCase() }))
			: setForm((prev: any) => ({
					...prev,
					[name]: value,
			  }));
	};

	const addPlan = () => {
		if (planForm.name && planForm.price) {
			setPlans([...plans, ...[planForm]]);
			setPlanForm(DEFAULT_VALUES.planForm);
			setGeneralError("");
		} else {
			// plan add error
			setGeneralError("Please enter a valid name and price for a plan");
		}
	};

	const removePlan = (i: number) => setPlans([...plans.toSpliced(i, 1)]);

	const toggleEditMode = (value: boolean | undefined | null) => setIsEditMode(value || !isEditMode);

	const confirmTemplate = () => {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<h1 style={{ marginBottom: "10px" }}>CREATING NEW SUBDIVISION</h1>
				<p style={{ margin: "20px 0" }}>Continue?</p>
			</div>
		);
	};

	const deleteTemplate = () => {
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
				<p style={{ margin: "20px 0" }}>Continue?</p>
			</div>
		);
	};

	const headerTemplate = () => {
		return (
			<header className={isHeaderShown ? "active" : ""} style={{ gap: 5 }}>
				<Card
					style={{
						display: "flex",
						justifyContent: "center",
						gap: 20,
						padding: "3px 10px 3px 20px",
					}}
					mini
				>
					<Switch
						name="edit"
						id={subd._id}
						label={
							<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
								<IconEdit style={{ height: 15, width: "auto" }} /> Edit Mode
							</div>
						}
						checked={isEditMode}
						onChange={toggleEditMode}
						mini
					/>
				</Card>
				<ConfirmModal
					className="delete-container"
					template={deleteTemplate}
					continue={props.handleDelete}
				>
					{(showConfirmModal: any) => {
						return (
							<button type="button" className="delete-button invisible" onClick={showConfirmModal}>
								<IconTrash />
							</button>
						);
					}}
				</ConfirmModal>
			</header>
		);
	};

	const getImage = async () => {
		// const url = `${process.env.NEXT_PUBLIC_MID}/api/misc/image?${new URLSearchParams({
		// 	type: "qr",
		// 	filename: props.subd.gcash.qr.filename,
		// })}`;
		const url = `http://localhost:4000/qr/${props.subd.gcash.qr.filename}`;
		return await fetch(url, {
			method: "GET",
		});
	};

	const handleSubmit = () => {
		toggleEditMode(false);
		props.handleSubmit(null, { ...form, ...{ plans: plans } });
	};

	const validate = (e: any) => {
		// REFACTOR: this is shit
		e.preventDefault();
		if (!form.name) {
			setGeneralError("Name is required");
			return false;
		}
		if (!form.code) {
			setGeneralError("Code is required");
			return false;
		}
		if (!form.number) {
			setGeneralError("Number is required");
			return false;
		}
		if (!form.qr) {
			setGeneralError("QR image is required");
			return false;
		}
		if (!plans.length) {
			setGeneralError("Please add at least 1(one) plan");
			return false;
		}
		setGeneralError("");
		return true;
		// REFACTOR: this is shit
	};

	useEffect(() => {
		if (props.subd) {
			const qr = props.subd.gcash.qr;
			getImage()
				.then((res) => res.blob())
				.then((blob) => {
					const file = new File([blob], qr.filename, { type: blob.type });
					setForm({
						_id: subd._id,
						name: subd.name,
						code: subd.code,
						number: subd.gcash.number,
						plans: subd.plans,
						qr: file,
					});
				})
				.catch((error) => console.error(error));
		}
	}, [props.subd]);

	// if has form
	//    if has value edit
	//    else create
	// else no form
	return (
		<>
			{isEditMode ? (
				<Card
					className="subd"
					onMouseEnter={() => setIsHeaderShown(true)}
					onMouseLeave={() => setIsHeaderShown(false)}
					style={!subd ? { width: "550px" } : {}}
				>
					{subd && headerTemplate()}
					<ConfirmModal template={confirmTemplate} continue={handleSubmit}>
						{(showConfirmModal: any) => {
							return (
								<form
									onSubmit={(e) => validate(e) && showConfirmModal(e)}
									style={{ display: "flex", flexDirection: "column", gap: "20px" }}
								>
									<div style={{ width: "100%", display: "flex", gap: 20 }}>
										<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
											<div style={{ display: "flex", gap: 10 }}>
												<FormGroup style={{ width: "70%" }}>
													<TextInput
														type="text"
														name="name"
														value={form.name}
														minLength="2"
														onChange={updateForm}
														placeholder="Name"
														style={{ fontSize: "20px", textTransform: "uppercase" }}
														mini
														line
														required
													/>
												</FormGroup>
												<FormGroup style={{ width: "30%" }}>
													<TextInput
														type="text"
														name="code"
														value={form.code}
														minLength="2"
														onChange={updateForm}
														placeholder="Code"
														style={{ fontSize: "20px", textTransform: "uppercase" }}
														mini
														line
														required
													/>
												</FormGroup>
											</div>
											<FormGroup>
												<TextInput
													type="tel"
													name="number"
													value={form.number}
													minLength="12"
													maxLength="12"
													onChange={updateForm}
													placeholder="___ ___ ____"
													style={{ fontSize: "16px", color: "#838383", fontWeight: "600" }}
													mini
													line
													required
												/>
											</FormGroup>
										</div>
										<div style={{ display: "flex", gap: 10, width: "50%" }}>
											<FileInput name="qr" value={form.qr} onChange={updateForm} mini />
										</div>
									</div>
									<Table type="plans" className="create" headers={TABLE_HEADERS.plans}>
										{plans &&
											plans.map((plan: any, i: any) => {
												return (
													<tr key={i} className="plans create border">
														<td title={plan.name}>{plan.name}</td>
														<td title={plan.price}>{plan.price}</td>
														<td className="ellipsis" title={plan.description}>
															{plan.description}
														</td>
														<td>
															<label htmlFor="remove" className="sr-only">
																Remove
															</label>
															<button
																type="button"
																name="remove"
																onClick={() => removePlan(i)}
																className="invisible button__action"
															>
																<IconRemove
																	style={{ display: "flex", justifyContent: "center", height: 20 }}
																/>
															</button>
														</td>
													</tr>
												);
											})}
										<tr className="plans create border">
											<td>
												<TextInput
													type="text"
													name="name"
													value={planForm.name}
													onChange={(e: Event) => updateForm(e, true)}
													placeholder="Name"
													mini
													line
												/>
											</td>
											<td>
												<TextInput
													type="number"
													name="price"
													value={planForm.price}
													maxLength={5}
													onChange={(e: Event) => updateForm(e, true)}
													placeholder="Price"
													mini
													line
												/>
											</td>
											<td>
												<TextInput
													type="text"
													name="description"
													value={planForm.description}
													onChange={(e: Event) => updateForm(e, true)}
													placeholder="Description"
													mini
													line
												/>
											</td>
											<td>
												<label htmlFor="add" className="sr-only">
													Add
												</label>
												<button
													type="button"
													name="add"
													onClick={addPlan}
													className="invisible button__action"
												>
													<IconAdd
														style={{ display: "flex", justifyContent: "center", height: 20 }}
													/>
												</button>
											</td>
										</tr>
									</Table>
									{generalError && <span className="general-error">{generalError}</span>}
									<div style={{ width: "100%", position: "relative", display: "flex", gap: 10 }}>
										{!subd && (
											<FormGroup style={{ width: "100%" }}>
												<Button type="button" onClick={() => props.setIsShown(false)}>
													CANCEL
												</Button>
											</FormGroup>
										)}
										<FormGroup style={{ width: "100%" }}>
											<Button type="submit" className="info">
												{subd ? "APPLY" : "SUBMIT"}
											</Button>
										</FormGroup>
									</div>
								</form>
							);
						}}
					</ConfirmModal>
				</Card>
			) : (
				// if no form
				subd && (
					<Card
						className="subd"
						onMouseEnter={() => setIsHeaderShown(true)}
						onMouseLeave={() => setIsHeaderShown(false)}
					>
						{headerTemplate()}
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<div>
								<h1>
									{subd.name}
									<span>({subd.code})</span>
								</h1>
								<span>{subd.gcash.number}</span>
								<br />
								<span>Last updated: {new Date(subd.updatedAt).toLocaleDateString()}</span>
								<br />
								<span>Created on: {new Date(subd.createdAt).toLocaleDateString()}</span>
							</div>
							<div>
								<div className="qr-container">
									<Image
										alt="qr"
										height={0}
										width={0}
										src={`${process.env.NEXT_PUBLIC_API}/qr/${subd.gcash.qr.filename}`}
										unoptimized
										style={{ height: "100px", width: "auto", borderRadius: 10 }}
									/>
								</div>
							</div>
						</div>
						<Table type="plans" className="" headers={TABLE_HEADERS.plans}>
							{subd.plans &&
								subd.plans.map((plan: any, i: any) => {
									return (
										<tr key={plan._id + i} className="plans border">
											<td title={plan.name}>{plan.name}</td>
											<td title={plan.price}>{plan.price}</td>
											<td className="ellipsis" title={plan.description}>
												{plan.description}
											</td>
										</tr>
									);
								})}
						</Table>
						{/* <pre>{JSON.stringify(subd, null, 2)}</pre> */}
					</Card>
				)
			)}
		</>
	);
};

export default SubdCard;
