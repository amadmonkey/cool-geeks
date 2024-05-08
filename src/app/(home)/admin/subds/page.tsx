"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/app/ui/components/modal/modal";
import SubdCard from "@/app/ui/components/subd-card/subd-card";
import ListEmpty from "@/app/ui/components/table/empty/list-empty";

import IconSubd from "../../../../../public/subd.svg";
import IconSubdAdd from "../../../../../public/subd-add.svg";
import IconLoading from "../../../../../public/loading.svg";

import "./page.scss";

const Subds = () => {
	const { push } = useRouter();
	const [list, setList] = useState<any>(null);
	const [filteredList, setFilteredList] = useState<any>(null);
	const [createIsShown, setCreateIsShown] = useState(false);

	const handleSubmit = async (e: any, form: any) => {
		setCreateIsShown(false);
		e && e.preventDefault();
		console.log("form", form);
		if (!form.plans.length) {
			return;
		}
		const formData = new FormData();
		form._id && formData.append("_id", form._id);
		form.qr && formData.append("qr", form.qr);
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
				const updatedList = list.map((subd: any) => (subd._id === data._id ? data : subd));
				setList(updatedList);
				setFilteredList(updatedList);
				// show success toast
				break;
			case 400:
				// handle errors
				console.log("subd submit 400", data);
				break;
			default:
				console.log("subd submit default", data);
				break;
		}
		// show toast
	};

	useEffect(() => {
		const searchOptions = new URLSearchParams({
			page: "1",
			limit: "5",
			sort: JSON.stringify({
				name: "asc",
				code: "asc",
			}),
		});
		fetch(`http://localhost:3000/api/subd?${searchOptions}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})
			.then((res) => res.json())
			.then((res) => {
				const { code, data } = res;
				console.log(data);
				switch (code) {
					case 200:
						console.log("subd list", data);
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
			})
			.catch((err) => console.log("getSubds catch", err));
	}, [push]);

	return (
		<section style={{ display: "flex", flexDirection: "column", width: "100%" }}>
			<header className="page-header">
				<h1
					className="section-title"
					style={{
						gap: "5px",
						display: "flex",
						marginBottom: "unset",
						alignItems: "center",
					}}
				>
					<IconSubd
						style={{ height: "35px", width: "35px", fill: "#e39d69", marginLeft: "10px" }}
					/>
					Subdivisions
				</h1>
				<div>
					<button type="button" className="has-icon outline" onClick={() => setCreateIsShown(true)}>
						<IconSubdAdd style={{ height: "25px", width: "auto" }} />
						<span style={{ fontSize: "16px" }}>ADD SUBDIVISION</span>
					</button>
				</div>
			</header>
			<div className="content content__subds">
				{filteredList === null ? (
					<IconLoading />
				) : filteredList.length ? (
					<>
						{filteredList.map((subd: any, i: number) => {
							return <SubdCard key={subd._id + i} subd={subd} handleSubmit={handleSubmit} />;
						})}
						<button
							style={{
								height: "500px",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
							}}
							className="add-subdivision invisible"
							onClick={() => setCreateIsShown(true)}
						>
							<IconSubdAdd style={{ height: "100px", width: "auto" }} />
							<span>NEW SUBDIVISION</span>
						</button>
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
		</section>
	);
};

export default Subds;
