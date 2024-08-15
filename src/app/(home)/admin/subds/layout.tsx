"use client";

import { useState, useRef, useEffect } from "react";
import { SKELETON_TYPES, STRING_UTILS } from "@/utility";
import { useSearchParams, useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";

// components
import Table from "@/app/ui/components/table/table";
import Section from "@/app/ui/components/section/section";
import Skeleton from "@/app/ui/components/skeleton/skeleton";
import ListEmpty from "@/app/ui/components/table/empty/list-empty";

// svgs
import IconSubd from "@/public/subd.svg";
import IconSubdAdd from "@/public/subd-add.svg";

// styles
import "./layout.scss";

export default function SubdsNav(props: any) {
	const { push } = useRouter();
	const getSubdsSignal = useRef<any>();
	const getSubdsController = useRef<any>();
	const mounted = useRef(false);
	const [list, setList] = useState<any>(null);
	const currentPathname = usePathname();
	const params = useParams<{ subd: string }>();
	const updated = useSearchParams().get("updated") || "";

	const getSubds = () => {
		setList(null);
		getSubdsController.current = new AbortController();
		getSubdsSignal.current = getSubdsController.current.signal;
		const searchOptions =
			props.searchOptions ||
			new URLSearchParams({
				page: "1",
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
			signal: getSubdsSignal.current,
			credentials: "include",
		})
			.then((res) => res.json())
			.then(async (res) => {
				if (mounted.current) {
					const { code, data } = res;
					switch (code) {
						case 200:
							setList(data);
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

	// useEffect(() => {
	// 	mounted.current = true;
	// 	!updated && getSubds(1);
	// 	return () => {
	// 		mounted.current = false;
	// 	};
	// }, []);

	useEffect(() => {
		mounted.current = true;
		getSubds();
		return () => {
			mounted.current = false;
		};
	}, [updated]);

	return (
		<Section title={sectionTitle(props.title, currentPathname)} others={sectionExtras()}>
			<div className="content__subds">
				<div className="list-container">
					<label>SELECT ONE</label>
					<Table>
						{list === null ? (
							<Skeleton type={SKELETON_TYPES.ACCOUNTS} />
						) : list.length ? (
							list?.map((subd: any, index: number) => {
								return (
									<tr
										key={index}
										className={
											subd.name.toLowerCase().split(" ").join("-") === params.subd ? "active" : ""
										}
									>
										<td>
											<Link
												href={
													params.subd === STRING_UTILS.SPACE_TO_DASH(subd.name.toLowerCase())
														? "/admin/subds"
														: `/admin/subds/${subd.name.toLowerCase().split(" ").join("-")}`
												}
											>
												{subd.name} <span>({subd.code.toUpperCase()})</span>
											</Link>
										</td>
									</tr>
								);
							})
						) : (
							<ListEmpty label="No entries found" />
						)}
						<tr>
							<td>
								<Link href="/admin/subds/create">
									<IconSubdAdd /> New Subdivision
								</Link>
							</td>
						</tr>
					</Table>
				</div>
				<div className="subd-container">{props.children}</div>
			</div>
		</Section>
	);
}

const sectionTitle = (title: string, currentPathname: string) => (
	<>
		<IconSubd />
		{title || (currentPathname.includes("create") ? "Add Subdivision" : "Subdivisions")}
	</>
);

const sectionExtras = () => (
	<div>
		<Link href="/admin/subds/create" type="button" className="has-icon outline">
			<IconSubdAdd style={{ height: "25px", width: "auto" }} />
			<span style={{ fontSize: "16px" }}>ADD SUBDIVISION</span>
		</Link>
	</div>
);
