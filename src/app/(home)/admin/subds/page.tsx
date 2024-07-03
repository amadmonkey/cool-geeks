"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SKELETON_TYPES } from "@/utility";

import Modal from "@/app/ui/components/modal/modal";
import SubdCard from "@/app/ui/components/subd-card/subd-card";
import ListEmpty from "@/app/ui/components/table/empty/list-empty";
import Section from "@/app/ui/components/section/section";
import Skeleton from "@/app/ui/components/skeleton/skeleton";

import IconSubd from "../../../../../public/subd.svg";
import IconSubdAdd from "../../../../../public/subd-add.svg";
import "./page.scss";

const Subds = (props: any) => {
	const { push } = useRouter();
	const mounted = useRef(false);
	const [list, setList] = useState<any>(null);
	const [createIsShown, setCreateIsShown] = useState(false);
	const [filteredList, setFilteredList] = useState<any>(null);

	const handleSubmit = async (e: any, form: any) => {
		e && e.preventDefault();
		const formData = new FormData();
		form._id && formData.append("_id", form._id);
		formData.append("qr", form.qr);
		formData.append("name", form.name);
		formData.append("code", form.code);
		formData.append("number", form.number);
		formData.append("plans", JSON.stringify(form.plans));
		const { code, data } = await fetch("/api/subd", {
			method: form._id ? "PUT" : "POST",
			headers: {},
			body: formData,
			credentials: "include",
		}).then((res) => res.json());
		switch (code) {
			case 200:
				if (form._id) {
					const updatedData = list.map((subd: any) => (subd._id === data._id ? data : subd));
					setList(updatedData);
					setFilteredList(updatedData);
				} else {
					getSubds();
				}
				// show success toast
				break;
			case 400:
				// handle errors
				console.log("subd submit 400", data);
				break;
			default:
				// show failed toast
				console.log("subd submit default", data);
				break;
		}
		setCreateIsShown(false);
	};

	const getSubds = useCallback(() => {
		setList(null);
		setFilteredList(null);
		const searchOptions =
			props.searchOptions ||
			new URLSearchParams({
				page: "1",
				limit: "5",
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
	}, [push]);

	const handleDelete = (id: string) => {
		fetch(`${process.env.NEXT_PUBLIC_MID}/api/subd`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ _id: id }),
			credentials: "include",
		})
			.then((res) => res.json())
			.then(async (res) => {
				if (mounted.current) {
					const { code, data } = res;
					switch (code) {
						case 200:
							// const updatedData = list.map((subd: any) => (subd._id === data._id ? data : subd));
							const updatedData = list.filter((subd: any) => subd._id !== data._id);
							setList(updatedData);
							setFilteredList(updatedData);
							setCreateIsShown(false);
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
	}, []);

	return (
		<Section title={sectionTitle(props.title)} others={sectionExtras()}>
			<div className={`content content__subds ${filteredList === null ? "loading" : ""}`}>
				{filteredList === null ? (
					<Skeleton type={SKELETON_TYPES.SUBD} />
				) : filteredList.length ? (
					<>
						{filteredList.map((subd: any, i: number) => {
							return (
								<SubdCard
									key={subd._id + i}
									subd={subd}
									handleSubmit={handleSubmit}
									handleDelete={() => handleDelete(subd._id)}
								/>
							);
						})}
						{!props.title && (
							<button
								className="add-subdivision invisible"
								onClick={() => setCreateIsShown(true)}
								style={{ height: 500 }}
							>
								<IconSubdAdd style={{ height: "100px", width: "auto" }} />
								<span style={{ fontWeight: 800, fontSize: 30 }}>ADD SUBDIVISION</span>
							</button>
						)}
					</>
				) : (
					<ListEmpty />
				)}
			</div>
			<Modal isShown={createIsShown} close={() => setCreateIsShown(false)}>
				<SubdCard
					isCreating={true}
					setIsShown={(val: boolean) => setCreateIsShown(val)}
					handleSubmit={handleSubmit}
				/>
			</Modal>
		</Section>
	);
};

const sectionTitle = (title: string) => (
	<>
		<IconSubd />
		{title || "Subdivisions"}
	</>
);

const sectionExtras = () => (
	<div>
		<button type="button" className="has-icon outline">
			<IconSubdAdd style={{ height: "25px", width: "auto" }} />
			<span style={{ fontSize: "16px" }}>ADD SUBDIVISION</span>
		</button>
	</div>
);

export default Subds;
