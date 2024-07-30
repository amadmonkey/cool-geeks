// if (req.cookies.get("accessToken")) {
// 	console.log("middleware accessToken valid");
// 	return NextResponse.next();
// } else {
// try {
// 	console.log("middleware accessToken invalid. get new token");
// const apiResponse = await REQUEST.post("http://localhost:4000/token/refresh", req, {
// 	token: req.cookies.get("refreshToken")?.value,
// });
// console.log("apiResponse.url", apiResponse.url);
// const res = await apiResponse.json();
// const newResponse = NextResponse.next();
// switch (res.code) {
// 	case 200:
// 		console.log("refresh token successful", apiResponse.headers.getSetCookie().toString());
// 		newResponse.headers.set("Set-Cookie", apiResponse.headers.getSetCookie().toString());
// 		const accessToken = apiResponse.headers
// 			.getSetCookie()[0]
// 			.split(", ")[0]
// 			.split(";")[0]
// 			.split("=")[1];
// 		const refreshToken = apiResponse.headers
// 			.getSetCookie()[0]
// 			.split(", ")[2]
// 			.split(";")[0]
// 			.split("=")[1];
// 		newResponse.cookies.set("accessToken", accessToken, {
// 			httpOnly: true, // Cookie will not be exposed to client side code
// 			sameSite: "lax", // If client and server origins are different
// 			secure: false, // use with HTTPS only
// 			maxAge: 10,
// 		});
// 		newResponse.cookies.set("refreshToken", refreshToken, {
// 			httpOnly: true, // Cookie will not be exposed to client side code
// 			sameSite: "lax", // If client and server origins are different
// 			secure: false, // use with HTTPS only
// 			maxAge: 3600,
// 		});
// 		return newResponse;
// 	default:
// 		console.log("refresh token failed");
// 		return NextResponse.redirect(new URL("/login", req.url));
// }
// } catch (e) {
// 	console.log("middleware catch", e);
// 	return NextResponse.redirect(new URL("/login", req.url));
// }
// }

// const EditTemplate = (props: any) => {
// 	const [plans, setPlans]: any = useState([]);
// 	const [form, setForm] = useState(formDefault);
// 	const [planForm, setPlanForm] = useState(planDefault);
// 	const imageRef = useRef<HTMLImageElement>(null);

// 	const updateForm = (e: any, plan: boolean) => {
// 		const { name, value, type } = e.target;
// 		plan
// 			? setPlanForm((prev) => ({ ...prev, [name]: value.toUpperCase() }))
// 			: setForm((prev) => ({ ...prev, [name]: type === "file" ? value.current.files[0] : value }));
// 	};

// 	const addPlan = () => {
// 		if (planForm.name && planForm.price) {
// 			setPlans([...plans, ...[planForm]]);
// 			setPlanForm(planDefault);
// 		}
// 	};

// 	const removePlan = (i: number) => {
// 		plans.splice(i, 1);
// 		setPlans([...plans]);
// 	};

// 	const handleSubmit = async (e: any) => {
// 		const formData = new FormData();
// 		formData.append("name", form.name);
// 		formData.append("code", form.code);
// 		formData.append("number", form.number);
// 		form.qr && formData.append("qr", form.qr);
// 		formData.append("plans", JSON.stringify(plans));
// 		const { code, data } = await fetch("/api/subd", {
// 			method: "POST",
// 			headers: {},
// 			body: formData,
// 			credentials: "include",
// 		}).then((res) => res.json());
// 		switch (code) {
// 			case 200:
// 				console.log("subd submit 200", data);
// 				props.setIsShown(false);
// 				break;
// 			case 400:
// 				// handle errors
// 				console.log("subd submit 400", data);
// 				break;
// 			default:
// 				console.log("subd submit default", data);
// 				// props.push("/login");
// 				break;
// 		}
// 	};

// 	const confirmTemplate = () => {
// 		return (
// 			<div
// 				style={{
// 					display: "flex",
// 					justifyContent: "center",
// 					flexDirection: "column",
// 					alignItems: "center",
// 				}}
// 			>
// 				<h1 style={{ marginBottom: "10px" }}>CREATING NEW SUBDIVISION</h1>
// 				<p style={{ margin: "20px 0" }}>Continue?</p>
// 			</div>
// 		);
// 	};

// 	return (
// 		<Card
// 			className="subd"
// 			style={{
// 				position: "relative",
// 				display: "flex",
// 				flexDirection: "column",
// 				gap: 10,
// 			}}
// 		>
// 			<ConfirmModal template={confirmTemplate} continue={handleSubmit}>
// 				{(showConfirmModal: any) => {
// 					return (
// 						<form
// 							onSubmit={showConfirmModal}
// 							style={{ display: "flex", flexDirection: "column", gap: "20px" }}
// 						>
// 							<div style={{ width: "100%", display: "flex", gap: 20 }}>
// 								<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
// 									<div style={{ display: "flex", gap: 10 }}>
// 										<FormGroup style={{ width: "70%" }}>
// 											<TextInput
// 												type="text"
// 												name="name"
// 												value={form.name}
// 												minLength="2"
// 												onChange={updateForm}
// 												placeholder="Name"
// 												style={{ fontSize: "20px", textTransform: "uppercase" }}
// 												mini
// 												line
// 												required
// 											/>
// 										</FormGroup>
// 										<FormGroup style={{ width: "30%" }}>
// 											<TextInput
// 												type="text"
// 												name="code"
// 												value={form.code}
// 												minLength="2"
// 												onChange={updateForm}
// 												placeholder="Code"
// 												style={{ fontSize: "20px", textTransform: "uppercase" }}
// 												mini
// 												line
// 												required
// 											/>
// 										</FormGroup>
// 									</div>
// 									<FormGroup>
// 										<TextInput
// 											type="tel"
// 											name="number"
// 											value={form.number}
// 											minLength="12"
// 											maxLength="12"
// 											onChange={updateForm}
// 											placeholder="___ ___ ____"
// 											style={{ fontSize: "16px" }}
// 											mini
// 											line
// 											required
// 										/>
// 									</FormGroup>
// 								</div>
// 								<div style={{ display: "flex", gap: 10, width: "50%" }}>
// 									<FileInput
// 										name="qr"
// 										value={form.qr}
// 										onChange={(e: any) => updateForm(e, false)}
// 										mini
// 									/>
// 								</div>
// 							</div>

// 							<Table className="plans create" headers={TABLE_HEADERS.plans}>
// 								{plans &&
// 									plans.map((plan: any, i: any) => {
// 										return (
// 											<tr key={i} className="plans create border">
// 												<td title={plan.name}>{plan.name}</td>
// 												<td title={plan.price}>{plan.price}</td>
// 												<td className="ellipsis" title={plan.description}>
// 													{plan.description}
// 												</td>
// 												<td>
// 													<label htmlFor="remove" className="sr-only">
// 														Remove
// 													</label>
// 													<button
// 														type="button"
// 														name="remove"
// 														onClick={() => removePlan(i)}
// 														className="invisible button__action"
// 													>
// 														<IconRemove style={{ height: "28px" }} />
// 													</button>
// 												</td>
// 											</tr>
// 										);
// 									})}
// 								<tr className="plans create border">
// 									<td>
// 										<TextInput
// 											type="text"
// 											name="name"
// 											value={planForm.name}
// 											onChange={(e: any) => updateForm(e, true)}
// 											placeholder="Name"
// 											mini
// 											line
// 										/>
// 									</td>
// 									<td>
// 										<TextInput
// 											type="number"
// 											name="price"
// 											value={planForm.price}
// 											maxLength={5}
// 											onChange={(e: any) => updateForm(e, true)}
// 											placeholder="Price"
// 											mini
// 											line
// 										/>
// 									</td>
// 									<td>
// 										<TextInput
// 											type="text"
// 											name="description"
// 											value={planForm.description}
// 											onChange={(e: any) => updateForm(e, true)}
// 											placeholder="Description"
// 											mini
// 											line
// 										/>
// 									</td>
// 									<td>
// 										<label htmlFor="add" className="sr-only">
// 											Add
// 										</label>
// 										<button
// 											type="button"
// 											name="add"
// 											onClick={addPlan}
// 											className="invisible button__action"
// 										>
// 											<IconAdd style={{ height: "28px" }} />
// 										</button>
// 									</td>
// 								</tr>
// 							</Table>
// 							{/* <pre>{JSON.stringify(plans, null, 2)}</pre> */}
// 							<div style={{ width: "100%", position: "relative", display: "flex", gap: 10 }}>
// 								<FormGroup style={{ width: "100%" }}>
// 									<Button type="button" onClick={() => props.setIsShown(false)}>
// 										CANCEL
// 									</Button>
// 								</FormGroup>
// 								<FormGroup style={{ width: "100%" }}>
// 									<Button type="submit" className="info">
// 										SUBMIT
// 									</Button>
// 								</FormGroup>
// 							</div>
// 						</form>
// 					);
// 				}}
// 			</ConfirmModal>
// 		</Card>
// 	);
// };

// const getHistoryList = async () => {
// 	const searchOptions = new URLSearchParams({
// 		page: "1",
// 		limit: "5",
// 		sortBy: "createdAt",
// 		sortOrder: "DESC",
// 	});
// 	return await fetch(`${process.env.NEXT_PUBLIC_MID}/api/receipt?${searchOptions}`, {
// 		method: "GET",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		credentials: "include",
// 	}).then((res) => res.json());
// };

// const updatePayment = async () => {
// 	const { code, data } = await fetch("/api/receipt", {
// 		method: "PUT",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({
// 			id: selectedPayment._id,
// 			newStatus: selectedPayment.accepted ? "ACCEPTED" : "DENIED",
// 		}),
// 		credentials: "include",
// 	}).then((res) => res.json());

// 	const updatedList = list.map((item: any) => (item._id === selectedPayment._id ? data : item));
// 	setList(updatedList);
// 	// setFilteredList(updatedList);
// 	// setModalIsShown(false);
// };

// useEffect(() => {
// 	let mounted = true;
// 	getHistoryList()
// 		.then((res) => {
// 			if (mounted) {
// 				const { code, data } = res;
// 				switch (code) {
// 					case 200:
// 						// setList(data.list);
// 						// setFilteredList(data.list);
// 						break;
// 					case 401:
// 						push("/login");
// 						break;
// 					default:
// 						console.log("getHistoryList default", data);
// 						push("/login");
// 						break;
// 				}
// 			}
// 		})
// 		.catch((err) => console.log("getHistoryList catch", err));
// 	return () => {
// 		mounted = false;
// 	};
// }, [push]);
