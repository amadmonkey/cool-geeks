import React, { useState } from "react";
import { DATE_READABLE, STRING_UTILS, UI_TYPE } from "@/utility";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

// components
import Button from "../../button/button";
import Switch from "../../switch/switch";
import PlanUsers from "./plan-users/plan-users";
import ConfirmModal from "../../confirm-modal/confirm-modal";
import HoverBubble from "../../hover-bubble/hover-bubble";
import InlineEditInput from "../../inline-edit-input/inline-edit-input";

// types
import User from "@/app/ui/types/User";
import Plan from "@/app/ui/types/Plan";

// svgs
import IconMore from "../../../../../../public/more.svg";
import IconTrash from "../../../../../../public/trash2.svg";
import IconAccepted from "../../../../../../public/done.svg";
import IconInvalid from "../../../../../../public/invalid.svg";

const dashToSpace = (text: string) => STRING_UTILS.DASH_TO_SPACE(text).toLowerCase();
const spaceToDash = (text: string) => STRING_UTILS.SPACE_TO_DASH(text).toLowerCase();

const ACTION = {
	STATUS: "STATUS",
	DELETE: "DELETE",
};

type PlanProps = {
	data: Plan;
	onDelete: Function;
};

const PlanItem = (props: PlanProps) => {
	const { push } = useRouter();
	const planInitial = props.data;
	const currentPathname = usePathname();
	const [plan, setPlan] = useState<Plan>(props.data);
	const activePlan = useSearchParams().get("plan") || "";
	const active = plan.name.toLowerCase() === dashToSpace(activePlan);

	const updatePlanForm = async (e: any) => {
		let { name, value } = e.target;
		setPlan({ ...plan, [name]: value });
	};

	const getAction = (action?: string) => {
		switch (action) {
			case ACTION.STATUS:
				return { active: !plan.active };
			case ACTION.DELETE:
				return { deleted: true };
			default:
				return {};
		}
	};

	const handlePlanUpdate = async (e: any, action?: string) => {
		e && e.preventDefault();
		const { code, data } = await fetch("/api/plan", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...plan, ...getAction(action) }),
			credentials: "include",
		}).then((res) => res.json());
		switch (code) {
			case 200:
				setPlan({ ...data, ...{ users: plan.users } });
				Object.assign(planInitial, { ...data, ...{ users: plan.users } });
				toast.success("Plan updated successfully.");
				break;
			case 400:
				console.log(data);
				toast.error("Something went wrong. Please try again.");
				break;
			default:
				break;
		}
	};

	return (
		<tbody
			key={plan._id}
			className={`plan-item${plan.active ? " active" : " inactive"}${active ? " selected" : ""}`}
		>
			<tr
				className="plan-item__row"
				tabIndex={0}
				onClick={(e: any) => {
					e.stopPropagation();
					push(
						active
							? currentPathname
							: `${currentPathname}?${new URLSearchParams({
									plan: spaceToDash(plan.name),
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
						value={plan.name}
						className="text-info"
						inputStyle={{ height: "23px" }}
						onCancel={() => setPlan(planInitial)}
						onChange={(e: any) => updatePlanForm(e)}
						onSubmit={(e: any) => handlePlanUpdate(e)}
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
						className="text-info"
						value={plan.price}
						inputStyle={{ height: "23px" }}
						onCancel={() => setPlan(planInitial)}
						onChange={(e: any) => updatePlanForm(e)}
						onSubmit={(e: any) => handlePlanUpdate(e)}
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
						{active && (
							<>
								<div className="plan-content">
									<div className="plan-content__description">
										<label htmlFor="plan-description">NOTES</label>
										<form onSubmit={(e: any) => handlePlanUpdate(e)}>
											<textarea
												name="description"
												id="description"
												value={plan?.description || ""}
												onChange={(e: any) => updatePlanForm(e)}
											/>
											{plan.description !== plan?.description && (
												<div
													style={{
														display: "flex",
														justifyContent: "space-between",
														gap: "10px",
														marginTop: "10px",
													}}
												>
													<Button className="info" type="submit" style={{ height: "30px" }}>
														APPLY
													</Button>
												</div>
											)}
										</form>
									</div>
									<PlanUsers
										plan={plan}
										setUsers={(users: Array<User>) => setPlan({ ...plan, ...{ users: users } })}
										setPlanForm={(newPlanForm: any) => setPlan(newPlanForm)}
									/>
								</div>
								<footer>
									<Switch
										name={`plan-active-${plan._id}`}
										id={`plan-active-${plan._id}`}
										checked={plan.active}
										onChange={(e: any) => handlePlanUpdate(e, ACTION.STATUS)}
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
										continue={(e: any) => {
											handlePlanUpdate(e, ACTION.DELETE).then(() => props.onDelete());
										}}
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

export default PlanItem;
