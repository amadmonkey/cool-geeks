import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_VALUES, SKELETON_TYPES, UI_TYPE } from "@/utility";
import { toast } from "react-toastify";

// components
import PlanItem from "./plan-item/plan-item";
import Button from "../button/button";
import Skeleton from "../skeleton/skeleton";
import TextInput from "../text-input/text-input";
import ListEmpty from "../table/empty/list-empty";
import HoverBubble from "../hover-bubble/hover-bubble";

// types
import Plan from "@/app/ui/types/Plan";

// svgs
import IconHelp from "@/public/help.svg";

type SubdPlansProps = {
	subdId: string;
};

const SubdPlans = (props: SubdPlansProps) => {
	const { push } = useRouter();
	const mounted = useRef(false);
	const [planError, setPlanError] = useState<string>("");
	const [plans, setPlans] = useState<Array<Plan> | null>(null);
	const [newPlanForm, setNewPlanForm] = useState(DEFAULT_VALUES.planForm);
	const [newPlanFormShow, setNewPlanFormShow] = useState<boolean>(false);

	const updateNewPlanForm = (e: any) => {
		let { name, value } = e.target;
		setNewPlanForm((prev: any) => ({ ...prev, [name]: value }));
	};

	const getPlans = () => {
		const searchOptions = new URLSearchParams({
			filter: JSON.stringify({
				subdRef: props.subdId,
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
							// setPlanForm(data);
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

	const addPlan = async () => {
		try {
			const { code, data } = await fetch("/api/plan", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...newPlanForm, ...{ subdRef: props.subdId } }),
				credentials: "include",
			}).then((res) => res.json());
			switch (code) {
				case 200:
					setPlans((prev: any) => [...prev, data]);
					setNewPlanForm(DEFAULT_VALUES.planForm);
					setNewPlanFormShow(false);
					toast.success("Plan added successfully.");
					break;
				case 400:
					push("/login");
					break;
				default:
					push("/login");
					break;
			}
		} catch (err) {
			console.error(err);
		}
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

	useEffect(() => {
		mounted.current = true;
		getPlans();
		return () => {
			mounted.current = false;
		};
	}, []);

	return (
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
							{plans.map((plan: Plan) => {
								return <PlanItem key={plan._id} data={plan} onDelete={getPlans} />;
							})}
							{newPlanFormShow ? (
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
								<tbody>
									<tr>
										<td style={{ display: "flex", justifyContent: "end" }}>
											<Button
												type="button"
												className="primary"
												onClick={() => setNewPlanFormShow(!newPlanFormShow)}
												style={{ width: "100px", letterSpacing: "0", alignSelf: "end" }}
												mini
											>
												ADD PLAN
											</Button>
										</td>
									</tr>
								</tbody>
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
	);
};

export default SubdPlans;
