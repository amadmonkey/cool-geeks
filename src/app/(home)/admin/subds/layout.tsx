"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import Section from "@/app/ui/components/section/section";
import Table from "@/app/ui/components/table/table";
import Skeleton from "@/app/ui/components/skeleton/skeleton";
import ListEmpty from "@/app/ui/components/table/empty/list-empty";
import { SKELETON_TYPES, STRING_UTILS } from "@/utility";

import IconSubd from "../../../../../public/subd.svg";
import IconSubdAdd from "../../../../../public/subd-add.svg";
import "./layout.scss";

export default function SubdsNav(props: any) {
	const { push } = useRouter();
	const mounted = useRef(false);
	const [list, setList] = useState<any>(null);
	const [filteredList, setFilteredList] = useState<any>(null);
	const currentPathname = usePathname();
	const params = useParams<{ subd: string }>();
	const isNew = useSearchParams().get("new");

	const getSubds = () => {
		setList(null);
		setFilteredList(null);
		const searchOptions =
			props.searchOptions ||
			new URLSearchParams({
				page: "1",
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
							setList(data);
							setFilteredList(data);
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

	useEffect(() => {
		mounted.current = true;
		getSubds();
		return () => {
			mounted.current = false;
		};
	}, [isNew]);

	return (
		<Section title={sectionTitle(props.title, currentPathname)} others={sectionExtras()}>
			<div className="content__subds">
				<div className="list-container">
					<label>SELECT ONE</label>
					<Table>
						{filteredList === null ? (
							<Skeleton type={SKELETON_TYPES.ACCOUNTS} />
						) : filteredList.length ? (
							filteredList?.map((subd: any, index: number) => {
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
												{/* {params.subd}
												{STRING_UTILS.SPACE_TO_DASH(subd.name.toLowerCase())} */}
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
