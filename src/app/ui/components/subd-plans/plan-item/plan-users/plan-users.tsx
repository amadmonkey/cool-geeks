import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CONSTANTS, DATE_READABLE, STRING_UTILS } from "@/utility";

// types
import Plan from "@/app/ui/types/Plan";

type PlanUsersProps = {
	plan: Plan;
	setUsers: Function;
	setPlanForm: Function;
};

const PlanUsers = (props: PlanUsersProps) => {
	const plan = props.plan;
	const users = props.plan.users || null;
	const { push } = useRouter();
	const mounted = useRef(false);

	const getUsers = async () => {
		try {
			if (mounted.current) {
				const searchOptions = new URLSearchParams({
					filter: JSON.stringify({
						planRef: plan._id,
					}),
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
						const { list } = data;
						// setUsers(list);
						props.setUsers(list);
						break;
					case 401:
						push("/login");
						break;
					default:
						push("/login");
						break;
				}
			}
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		mounted.current = true;
		!users && getUsers();
		return () => {
			mounted.current = false;
		};
	}, [props.plan]);

	return (
		<div className="plan-content__users">
			<table style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
				<thead>
					<tr>
						<td>USER</td>
						<td>SINCE</td>
					</tr>
				</thead>
				{users === null ? (
					<tbody>
						<tr style={{ gridTemplateColumns: "100%", padding: "40px" }}>
							<td>
								<Image src={CONSTANTS.loaderFixed} alt={"loader"} width={50} height={50} />
							</td>
						</tr>
					</tbody>
				) : users.length ? (
					<tbody>
						{users.map((user: any) => {
							return (
								<tr key={user._id}>
									<td>
										<Link
											href={`/admin/accounts/${STRING_UTILS.SPACE_TO_DASH(
												user.firstName.trim()
											)}-${STRING_UTILS.SPACE_TO_DASH(user.lastName.trim())}`}
										>{`${user.firstName} ${user.lastName}`}</Link>
									</td>
									<td>{DATE_READABLE(user.createdAt)}</td>
								</tr>
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
								<Image src={CONSTANTS.empty} alt={"loader"} width={50} height={50} />
							</td>
						</tr>
					</tbody>
				)}
			</table>
		</div>
	);
};

export default PlanUsers;
