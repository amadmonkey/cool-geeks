import React, { useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import { ACCOUNT_STATUS, CUTOFF_TYPE, SEARCH_TYPE } from "@/utility";

// components
import Dropdown from "@/app/ui/components/dropdown/dropdown";
import TextInput from "@/app/ui/components/text-input/text-input";
import FormGroup from "@/app/ui/components/form-group/form-group";
import RadioGroup from "@/app/ui/components/radio-group/radio-group";
import DetectOutsideClick from "@/app/ui/components/detect-outside-click/detect-outside-click";

// svgs
import IconCheck from "@/public/check.svg";
import IconMid from "@/public/midmonth.svg";
import IconAsc from "@/public/sort-asc.svg";
import IconSearch from "@/public/search.svg";
import IconDesc from "@/public/sort-desc.svg";
import IconEnd from "@/public/end-of-month.svg";

// styles
import "./filters.scss";

interface DateRange {
	start: string;
	end: string;
}

interface AccountsFilter {
	search: string;
	sortOrder: string;
	dateRange: DateRange;
	cutOffType: string;
	status: Object;
}

const sortOrderList = [
	{
		name: "desc",
		label: <IconDesc />,
	},
	{
		name: "asc",
		label: <IconAsc />,
	},
];

const dateTypeList = [
	{
		_id: "1",
		name: "Last 30 days",
		range: {
			start: DateTime.now().minus({ days: 30 }).toISO(),
			end: DateTime.now().toISO(),
		},
	},
	{
		_id: "2",
		name: "Last 60 days",
		range: {
			start: DateTime.now().minus({ days: 60 }).toISO(),
			end: DateTime.now().toISO(),
		},
	},
	{ _id: "3", name: "Set range", range: null },
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

const AccountsFilters = (props: any) => {
	const filters = props.filters;
	const [dateType, setDateType] = useState(dateTypeList[0]);
	const [dateRangeActive, setDateRangeActive] = useState(false);
	const [form, setForm] = useState<AccountsFilter>({
		search: "",
		sortOrder: sortOrderList[0].name,
		cutOffType: cutOffTypeList[0].name,
		dateRange: {
			start: "",
			end: "",
		},
		status: "ALL",
	});

	const updateForm = (e: any) => {
		let { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

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

	useEffect(() => {
		if (dateType !== dateTypeList[2]) {
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

	const immediate = useRef(true);
	useEffect(() => {
		let timer: any;
		if (form.dateRange.start) {
			timer = setTimeout(
				() => {
					props.handleFilter(true, form);
					immediate.current = true;
				},
				immediate.current ? 100 : 1000
			);
			immediate.current = false;
		}
		return () => clearTimeout(timer);
	}, [form]);

	useEffect(() => {
		updateForm({
			target: {
				name: "dateRange",
				value: dateTypeList[0].range,
			},
		});
	}, []);

	return (
		<div
			className={`filters ${props.className || ""}`}
			style={{ ...props.style, ...{ flexDirection: "column", gap: "10px" } }}
		>
			<div style={{ display: "flex", width: "100%", justifyContent: "space-between", gap: "10px" }}>
				<div style={{ display: "flex", gap: "10px" }}>
					<FormGroup row>
						<RadioGroup
							list={sortOrderList}
							selected={form.sortOrder}
							onChange={(v: any) => updateForm({ target: { name: "sortOrder", value: v } })}
						/>
					</FormGroup>
					<div style={{ position: "relative" }}>
						<Dropdown
							name=""
							style={{ width: "140px" }}
							list={dateTypeList}
							value={dateType}
							onChange={(v: any) => setDateType(v)}
							placeholder="Date"
							required
						/>
						<DetectOutsideClick action={() => setDateRangeActive(false)} isShown={true}>
							<div className={`date-range${dateRangeActive ? " active" : ""}`}>
								<div className="content-wrapper">
									<input
										name="dateRange_start"
										aria-label="Start"
										type="date"
										placeholder="From"
										value={DateTime.fromISO(form.dateRange.start).toFormat("yyyy-LL-dd")}
										onChange={updateFormDate}
									/>
									<input
										name="dateRange_end"
										aria-label="End"
										type="date"
										placeholder="To"
										value={DateTime.fromISO(form.dateRange.end).toFormat("yyyy-LL-dd")}
										onChange={updateFormDate}
									/>
								</div>
							</div>
						</DetectOutsideClick>
					</div>
				</div>
				{/* HERE: finish accounts filters */}
				<FormGroup row>
					<TextInput
						name="search"
						placeholder="Search"
						value={form.search}
						icon={<IconSearch style={{ height: "15px", width: "auto" }} />}
						onChange={updateForm}
						hasIcon
					/>
				</FormGroup>
			</div>
			<div style={{ display: "flex", gap: "10px" }}>
				<RadioGroup
					list={cutOffTypeList}
					selected={form.cutOffType}
					onChange={(v: any) => updateForm({ target: { name: "cutOffType", value: v } })}
				/>
				<RadioGroup
					style={{ fontSize: "12px" }}
					list={["ALL", ...Object.keys(ACCOUNT_STATUS)].map((item: any) => {
						return { name: item, label: item };
					})}
					selected={form.status}
					onChange={(v: any) => updateForm({ target: { name: "status", value: v } })}
				/>
			</div>
			<span style={{ marginTop: "10px", fontSize: "15px", textAlign: "right" }}>
				Showing{" "}
				<span className="text-info" style={{ fontWeight: 800 }}>
					{filters.itemsCurrent}
				</span>{" "}
				out of{" "}
				<span className="text-info" style={{ fontWeight: 800 }}>
					{filters.itemsTotal}
				</span>{" "}
				result
				{filters.itemsCurrent > 1 ? "s" : ""} from{" "}
				<span className="text-info" style={{ fontWeight: 800 }}>
					{DateTime.fromISO(form.dateRange.start).toFormat("LLLL dd, yyyy")}
				</span>{" "}
				to{" "}
				<span className="text-info" style={{ fontWeight: 800 }}>
					{DateTime.fromISO(form.dateRange.end).toFormat("LLLL dd, yyyy")}
				</span>
			</span>
		</div>
	);
};

export default AccountsFilters;
