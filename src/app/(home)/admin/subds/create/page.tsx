"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { DEFAULT_VALUES, STRING_UTILS, VALID_IMG_TYPES } from "@/utility";

// components
import Button from "@/app/ui/components/button/button";
import TextInput from "@/app/ui/components/text-input/text-input";
import FileInput from "@/app/ui/components/file-input/file-input";
import ConfirmModal from "@/app/ui/components/confirm-modal/confirm-modal";

// svgs
import IconLoader from "@/public/loader.svg";

// styles
import "./page.scss";

const AddSubd = () => {
	const { push } = useRouter();
	const subdToastId = useRef<any>(null);
	const [plans, setPlans]: any = useState([]);
	const [generalError, setGeneralError] = useState("");
	const [qrError, setQrError] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [formSubd, setFormSubd] = useState(DEFAULT_VALUES.subdForm);
	const [formPlan, setFormPlan] = useState(DEFAULT_VALUES.planForm);
	const [loading, setLoading] = useState(false);

	const updateForm = async (e: any, isPlan?: Boolean) => {
		let { name, value } = e.target;
		setQrError("");
		setGeneralError("");
		name === "qr" && setFile(value);
		isPlan
			? setFormPlan((prev: any) => ({ ...prev, [name]: value }))
			: setFormSubd((prev: any) => ({
					...prev,
					[name]: value,
			  }));

		if (!isPlan && name === "name") {
			const exists = await getSubd(value.trim().toUpperCase());
			exists && setGeneralError("Subdivision name already exists");
		}
	};

	const getSubd = async (name: string) => {
		const searchOptions = {
			filter: JSON.stringify({
				name: name,
			}),
			page: "1",
			limit: "1",
			sort: JSON.stringify({
				name: "asc",
				code: "asc",
			}),
		};
		return await fetch(`/api/subd?${new URLSearchParams(searchOptions)}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})
			.then((res) => res.json())
			.then((res) => res.data[0]);
	};

	const addPlan = () => {
		if (formPlan.name && formPlan.price) {
			setPlans([...plans, ...[formPlan]]);
			setFormPlan(DEFAULT_VALUES.planForm);
			setGeneralError("");
		} else {
			// plan add error
			setGeneralError("Please enter a valid name and price for a plan");
		}
	};

	const handleSubmit = async (e: any) => {
		e && e.preventDefault();
		try {
			setLoading(true);
			subdToastId.current = toast("Creating new subdivision...", {
				autoClose: false,
				icon: <IconLoader style={{ height: "20px", stroke: "rgb(100, 100, 100)" }} />,
			});
			if (VALID_IMG_TYPES.includes(file!.type)) {
				const formData = new FormData();
				formData.append("qr", file!);
				formData.append("name", formSubd.name);
				formData.append("code", formSubd.code);
				formData.append("number", formSubd.number);
				formData.append("plans", JSON.stringify(plans));

				console.log("post");
				const { code, data } = await fetch("/api/subd", {
					method: "POST",
					headers: {},
					body: formData,
					credentials: "include",
				}).then((res) => res.json());

				toast.dismiss(subdToastId.current);
				setLoading(false);

				switch (code) {
					case 200:
						push(
							`/admin/subds/${STRING_UTILS.SPACE_TO_DASH(formSubd.name.toLowerCase())}?updated=true`
						);
						toast.success("Subdivision created.");
						break;
					case 400:
						toast.error(data.message);
						break;
					default:
						toast.error("Something went wrong. Please try again.");
						break;
				}
			}
		} catch (err) {
			console.error(err);
		}
	};

	const removePlan = (i: number) => setPlans([...plans.toSpliced(i, 1)]);

	const validate = (e: any) => {
		// REFACTOR: this is shit
		e.preventDefault();
		if (!formSubd.name) {
			setGeneralError("Name is required");
			return false;
		}
		if (!formSubd.code) {
			setGeneralError("Code is required");
			return false;
		}
		if (!formSubd.number) {
			setGeneralError("Number is required");
			return false;
		}
		if (!formSubd.qr) {
			setQrError("QR image is required");
			return false;
		}
		if (!plans.length) {
			setGeneralError("Please add at least 1(one) plan");
			return false;
		}
		if (qrError || generalError) return false;

		setGeneralError("");
		setQrError("");

		return true;
		// REFACTOR: this is shit
	};

	return (
		<>
			<ConfirmModal template={confirmTemplate} continue={handleSubmit}>
				{(showConfirmModal: any) => {
					return (
						<form className="subd-form" onSubmit={(e) => validate(e) && showConfirmModal(e)}>
							<div className="content__subd content__subd__create">
								<div className="subd-container">
									<div
										style={{
											width: "400px",
											display: "grid",
											gap: "10px",
											gridTemplateColumns: "3fr 1fr",
											alignItems: "start",
										}}
									>
										<TextInput
											type="text"
											name="name"
											value={formSubd.name}
											minLength="2"
											onChange={updateForm}
											placeholder="Name"
											disabled={loading}
											line
											required
										/>
										<TextInput
											type="text"
											name="code"
											value={formSubd.code}
											minLength="2"
											maxLength="3"
											onChange={updateForm}
											placeholder="Code"
											disabled={loading}
											line
											required
										/>
									</div>
									<TextInput
										type="tel"
										name="number"
										value={formSubd.number}
										minLength="12"
										maxLength="12"
										onChange={updateForm}
										placeholder="___ ___ ____"
										disabled={loading}
										line
										required
									/>
									<div className="plans-container">
										<header>
											<h1>PLANS</h1>
										</header>
										<table className="plan-table">
											<thead>
												<tr>
													<th>NAME</th>
													<th>RATE</th>
													<th>NOTES</th>
													<th>&nbsp;</th>
												</tr>
											</thead>
											{plans.length
												? plans.map((plan: any, i: number) => {
														return (
															<tbody className="plan-item" key={i}>
																<tr className="plan-item__row">
																	<td>{plan.name}</td>
																	<td>₱{plan.price}</td>
																	<td>{plan.description}</td>
																	<td>
																		<Button
																			name="removePlan"
																			type="button"
																			style={{
																				height: "30px",
																				fontSize: "12px",
																				letterSpacing: "0px",
																				fontWeight: "800",
																			}}
																			className="danger"
																			disabled={loading}
																			danger
																			onClick={() => removePlan(i)}
																		>
																			<label htmlFor="removePlan" className="sr-only">
																				REMOVE PLAN
																			</label>
																			REMOVE
																		</Button>
																	</td>
																</tr>
															</tbody>
														);
												  })
												: ""}
											<tbody className="plan-item">
												<tr className="plan-item__row">
													<td>
														<TextInput
															type="text"
															name="name"
															value={formPlan.name}
															minLength="2"
															onChange={(e: any) => updateForm(e, true)}
															placeholder="Name"
															noValidate
															disabled={loading}
															line
														/>
													</td>
													<td>
														<TextInput
															type="number"
															name="price"
															value={formPlan.price}
															maxLength={5}
															onChange={(e: any) => updateForm(e, true)}
															placeholder="Rate"
															disabled={loading}
															line
														/>
													</td>
													<td>
														<TextInput
															type="text"
															name="description"
															value={formPlan.description}
															minLength="2"
															onChange={(e: any) => updateForm(e, true)}
															placeholder="Notes"
															noValidate
															disabled={loading}
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
															onClick={addPlan}
															disabled={loading}
														>
															<label htmlFor="addPlan" className="sr-only">
																ADD PLAN
															</label>
															ADD
														</Button>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
									{generalError && <span className="general-error box">{generalError}</span>}
								</div>
								<div className="qr-container">
									<FileInput
										name="qr"
										value={formSubd.qr}
										onChange={updateForm}
										danger={qrError}
										disabled={loading}
									/>
									{qrError && <span className="general-error">{qrError}</span>}
								</div>
							</div>
							<Button
								type="submit"
								className="info"
								loading={loading}
								style={{ marginTop: "50px", float: "right", width: "300px" }}
							>
								SUBMIT
							</Button>
							{/* <pre>{JSON.stringify(formSubd.qr, undefined, 2)}</pre> */}
						</form>
					);
				}}
			</ConfirmModal>
		</>
	);
};

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
			<p>
				<i>ADD DETAILS HERE</i>
			</p>
			<p style={{ margin: "20px 0" }}>Continue?</p>
		</div>
	);
};

export default AddSubd;
