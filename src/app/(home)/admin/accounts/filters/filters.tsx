import React, { useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ACCOUNT_STATUS, CUTOFF_TYPE, UI_TYPE } from "@/utility";

// components
import Button from "@/app/ui/components/button/button";
import Dropdown from "@/app/ui/components/dropdown/dropdown";
import TextInput from "@/app/ui/components/text-input/text-input";
import FormGroup from "@/app/ui/components/form-group/form-group";
import Pagination from "@/app/ui/components/pagination/pagination";
import RadioGroup from "@/app/ui/components/radio-group/radio-group";
import DetectOutsideClick from "@/app/ui/components/detect-outside-click/detect-outside-click";

// types
import { Filters } from "@/app/ui/classes/filters";

// svgs
import IconXLS from "@/public/dl-xls.svg";
import IconCheck from "@/public/check.svg";
import IconMid from "@/public/midmonth.svg";
import IconSearch from "@/public/search.svg";
import IconRefresh from "@/public/refresh.svg";
import IconEnd from "@/public/end-of-month.svg";
import IconCalendar from "@/public/calendar.svg";

// styles
import "./filters.scss";
import HoverBubble from "@/app/ui/components/hover-bubble/hover-bubble";

interface AccountsFilter {
	search: string;
	sort: Object;
	page: string;
	dateRange: any;
	cutOffType: string;
	status: Object;
}

const dateTypeList = [
	{
		_id: "1",
		name: "All",
		range: null,
	},
	{
		_id: "2",
		name: "Last 30 days",
		range: {
			start: DateTime.now().minus({ days: 30 }).toISO(),
			end: DateTime.now().toISO(),
		},
	},
	{
		_id: "3",
		name: "Last 60 days",
		range: {
			start: DateTime.now().minus({ days: 60 }).toISO(),
			end: DateTime.now().toISO(),
		},
	},
	{ _id: "4", name: "Set range", range: { start: "", end: "" } },
];

const cutOffTypeList = [
	{
		name: "BOTH",
		label: <IconCheck style={{ height: 15, width: "auto" }} />,
	},
	{
		name: CUTOFF_TYPE.MID,
		label: <IconMid style={{ height: 25, width: "auto" }} />,
	},
	{
		name: CUTOFF_TYPE.END,
		label: <IconEnd style={{ height: 25, width: "auto" }} />,
	},
];

// TODO: column sort
const AccountsFilters = (props: any) => {
	const urlParams = useSearchParams();
	const pathname = usePathname();
	const { replace, refresh } = useRouter();
	const [params, setParams] = useState("");
	const [dateType, setDateType] = useState(dateTypeList[0]);
	const [dateRangeActive, setDateRangeActive] = useState(false);
	const [filters] = useState(new Filters(props.searchOptions || urlParams.entries()));
	const [form, setForm] = useState<AccountsFilter>({
		search: urlParams.get("search") || "",
		cutOffType: urlParams.get("cutoff")?.toUpperCase() || cutOffTypeList[0].name,
		page: urlParams.get("page") || "1",
		sort: urlParams.get("sort") || { updatedAt: "asc" },
		dateRange: urlParams.get("dateRange") ? JSON.parse(urlParams.get("dateRange") || "") : null,
		status: urlParams.get("status")?.toUpperCase() || "ALL",
	});

	const updateForm = (e: any) => {
		let { name, value } = e.target;
		const newVal = { [name]: value };

		const params = new URLSearchParams(Array.from(urlParams.entries()));
		params.sort();
		params.set(name, typeof value === "object" ? JSON.stringify(value) : value);

		if (name !== "page") {
			params.set("page", "1");
			Object.assign(newVal, { page: "1" });
		}

		setParams(params.toString());
		setForm((prev) => ({ ...prev, ...newVal }));
	};

	const immediate = useRef(true);
	useEffect(() => {
		let timer: any;
		immediate.current = true;
		timer = setTimeout(
			() => {
				filters.setQuery(form);
				filters.setPage(Number(form.page));
				!props.searchOptions && replace(`${pathname}?${params}`);
				props.handleFilter(filters);
			},
			immediate.current ? 200 : 1000
		);
		return () => {
			immediate.current = false;
			clearTimeout(timer);
		};
	}, [form]);

	// on date range change. either start or end
	const updateFormDate = (e: any) => {
		let { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			dateRange: {
				...form.dateRange,
				...{ [name.toLowerCase().includes("start") ? "start" : "end"]: value },
			},
		}));
	};

	// on date type change (e.g: last 30 days, last 60 days, date range)
	useEffect(() => {
		if (dateType !== dateTypeList[3]) {
			updateForm({
				target: {
					name: "dateRange",
					value: dateType.range,
				},
			});
		} else {
			setDateRangeActive(true);
		}
	}, [dateType]);

	useEffect(() => {
		updateForm({
			target: {
				name: "dateRange",
				value: dateTypeList[0].range,
			},
		});
	}, []);

	return (
		<>
			<div
				className={`filters ${props.className || ""}`}
				style={{ ...props.style, ...{ flexDirection: "column", gap: "10px" } }}
			>
				{!props.searchOptions && (
					<>
						<div
							style={{
								display: "flex",
								width: "100%",
								justifyContent: "space-between",
								gap: "10px",
							}}
						>
							<div style={{ display: "flex", gap: "10px" }}>
								<div style={{ position: "relative" }}>
									<FormGroup row>
										<IconCalendar style={{ height: "20px", width: "20px", stroke: "#555" }} />
										<Dropdown
											name=""
											style={{ width: "140px" }}
											list={dateTypeList}
											value={dateType}
											onChange={(v: any) => setDateType(v)}
											placeholder="Date"
											required
										/>
										<RadioGroup
											list={cutOffTypeList}
											selected={form.cutOffType}
											onChange={(v: any) =>
												updateForm({ target: { name: "cutOffType", value: v } })
											}
										/>
									</FormGroup>
									<DetectOutsideClick action={() => setDateRangeActive(false)} isShown={true}>
										<div className={`date-range${dateRangeActive ? " active" : ""}`}>
											<div className="content-wrapper">
												<input
													name="dateRange_start"
													aria-label="Start"
													type="date"
													placeholder="From"
													value={
														form.dateRange
															? DateTime.fromISO(form.dateRange.start).toFormat("yyyy-LL-dd")
															: ""
													}
													onChange={updateFormDate}
												/>
												<input
													name="dateRange_end"
													aria-label="End"
													type="date"
													placeholder="To"
													value={
														form.dateRange
															? DateTime.fromISO(form.dateRange.end).toFormat("yyyy-LL-dd")
															: ""
													}
													onChange={updateFormDate}
												/>
											</div>
										</div>
									</DetectOutsideClick>
								</div>
								<RadioGroup
									style={{ fontSize: "12px" }}
									list={["ALL", ...Object.keys(ACCOUNT_STATUS)].map((item: any) => {
										return { name: item, label: item };
									})}
									selected={form.status}
									onChange={(v: any) => updateForm({ target: { name: "status", value: v } })}
								/>
							</div>
							<FormGroup row>
								<TextInput
									name="search"
									placeholder="Search"
									value={form.search}
									icon={<IconSearch style={{ height: "15px", width: "auto" }} />}
									onChange={updateForm}
									hasIcon
								/>
								<div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
									<div style={{ display: "flex", gap: "5px" }}>
										<HoverBubble message="Clear filters" left>
											<Button
												style={{ width: "50px" }}
												danger
												onClick={() => {
													replace(`${pathname}`);
													setDateType(dateTypeList[0]);
													setForm({
														search: "",
														cutOffType: cutOffTypeList[0].name,
														page: "1",
														sort: { updatedAt: "asc" },
														dateRange: null,
														status: "ALL",
													});
													refresh();
												}}
											>
												<IconRefresh style={{ width: "25px" }} />
											</Button>
										</HoverBubble>
										<HoverBubble message="Download as XLS" left>
											<Button style={{ width: "50px" }} disabled>
												<IconXLS style={{ width: "30px", height: "30px" }} fill="#555" />
											</Button>
										</HoverBubble>
									</div>
								</div>
							</FormGroup>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							{props.loading ? (
								<span
									style={{
										gap: "5px",
										display: "flex",
										fontSize: "15px",
										marginTop: "10px",
										textAlign: "right",
										alignItems: "center",
									}}
								>
									Showing <span className="text-info skeleton" style={{ fontWeight: 800 }}></span>{" "}
									out of <span className="text-info skeleton" style={{ fontWeight: 800 }}></span>{" "}
									results from
									<span
										className={`text-info skeleton`}
										style={{ fontWeight: 800, width: "100px" }}
									></span>{" "}
									to{" "}
									<span
										className={`text-info skeleton`}
										style={{ fontWeight: 800, width: "100px" }}
									>
										{" "}
									</span>
								</span>
							) : (
								<span style={{ marginTop: "10px", fontSize: "15px", textAlign: "right" }}>
									Showing{" "}
									<span className="text-info" style={{ fontWeight: 800 }}>
										{filters.itemsCurrent}
									</span>{" "}
									out of{" "}
									<span className="text-info" style={{ fontWeight: 800 }}>
										{filters.itemsTotal}
									</span>{" "}
									results from{" "}
									{form.dateRange ? (
										<>
											<span className="text-info" style={{ fontWeight: 800, width: "100px" }}>
												{form.dateRange
													? DateTime.fromISO(form.dateRange.start).toFormat("LLLL dd, yyyy")
													: ""}
											</span>{" "}
											to{" "}
											<span className="text-info" style={{ fontWeight: 800, width: "100px" }}>
												{form.dateRange
													? DateTime.fromISO(form.dateRange.end).toFormat("LLLL dd, yyyy")
													: ""}
											</span>
										</>
									) : (
										"the start of time"
									)}
								</span>
							)}
							{!props.loading && <Pagination filters={filters} handleFilter={updateForm} />}
						</div>
					</>
				)}
			</div>
			{props.children}
			{!props.searchOptions && !props.loading && (
				<div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
					<Pagination name={2} filters={filters} handleFilter={updateForm} />
				</div>
			)}
		</>
	);
};

export default AccountsFilters;
