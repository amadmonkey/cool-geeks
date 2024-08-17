"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { DATE_READABLE, SKELETON_TYPES, STRING_UTILS } from "@/utility";

// components
import SubdQr from "@/app/ui/components/subd-qr/subd-qr";
import Skeleton from "@/app/ui/components/skeleton/skeleton";
import SubdPlans from "@/app/ui/components/subd-plans/subd-plans";
import InlineEditInput from "@/app/ui/components/inline-edit-input/inline-edit-input";

// types
import Subd from "@/app/ui/types/Subd";

// styles
import "./page.scss";

const SubdPage = (props: any) => {
	const { push } = useRouter();
	const mounted = useRef(false);
	const [subd, setSubd] = useState<Subd | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [subdForm, setSubdForm] = useState<any>(null);
	const [lastChanged, setLastChanged] = useState("");

	const updateSubdForm = async (e: any) => {
		let { name, value } = e.target;
		setLastChanged(value);
		setSubdForm((prev: any) => ({ ...prev, [name]: value }));
	};

	const fetchSubd = async (options: any) => {
		const { code, data } = await fetch(`/api/subd?${options}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		}).then((res) => res.json());
		const subd = data[0];
		switch (code) {
			case 200:
				if (subd) {
					return subd;
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
	};

	const getSubd = useCallback(async () => {
		try {
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

			const subd = await fetchSubd(searchOptions);
			setSubd(subd);
			setSubdForm(subd);
		} catch (e) {
			console.log(e);
		}
	}, [push]);

	const handleSubdUpdate = async (e: any) => {
		e && e.preventDefault();
		try {
			const { code, data } = await fetch("/api/subd", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ _id: subd!._id, ...subdForm }),
				credentials: "include",
			}).then((res) => res.json());
			switch (code) {
				case 200:
					setSubd(data);
					setSubdForm(data);
					toast.success("Subdivision updated successfully.");
					push(
						`/admin/subds/${STRING_UTILS.SPACE_TO_DASH(
							data.name.toLowerCase()
						)}?updated=${lastChanged}`
					);
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

	const resetSubdForm = () => setSubdForm(subd);

	useEffect(() => {
		mounted.current = true;
		getSubd();
		return () => {
			mounted.current = false;
		};
	}, []);

	return !subd ? (
		<Skeleton type={SKELETON_TYPES.SUBD} />
	) : (
		<div className="content__subd">
			<div className="subd-container">
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
							onSubmit={async (e: any) => {
								const searchOptions =
									props.searchOptions ||
									new URLSearchParams({
										filter: JSON.stringify({
											name: subdForm.name,
										}),
										page: "1",
										limit: "1",
										sort: JSON.stringify({
											name: "asc",
											code: "asc",
										}),
									});
								const exists = await fetchSubd(searchOptions);
								if (exists) {
									toast.error("Subdivision name already exists.");
								} else {
									handleSubdUpdate(e);
								}
							}}
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
						<p tabIndex={0}>(+63) {subd.number}</p>
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
				</header>
				<SubdPlans subdId={subd._id} />
			</div>
			<SubdQr subd={subd} file={file} handleFileUpdate={(file: File) => setFile(file)} />
		</div>
	);
};

export default SubdPage;
