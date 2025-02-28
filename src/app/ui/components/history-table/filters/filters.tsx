import React, { useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import { RECEIPT_STATUS } from "@/utility";

// components
import Dropdown from "@/app/ui/components/dropdown/dropdown";
import FormGroup from "@/app/ui/components/form-group/form-group";
import RadioGroup from "@/app/ui/components/radio-group/radio-group";
import DetectOutsideClick from "@/app/ui/components/detect-outside-click/detect-outside-click";

// svgs
import IconAsc from "@/public/sort-asc.svg";
import IconDesc from "@/public/sort-desc.svg";

// styles
import "./filters.scss";
import { usePathname, useSearchParams } from "next/navigation";
import { Filters } from "@/app/ui/classes/filters";

interface ReceiptsFilter {
	dateRange: any;
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
		name: "Past year",
		range: {
			start: DateTime.now().minus({ year: 1 }).toISO(),
			end: DateTime.now().toISO(),
		},
	},
	{
		_id: "2",
		name: "Past 3 years",
		range: {
			start: DateTime.now().minus({ year: 3 }).toISO(),
			end: DateTime.now().toISO(),
		},
	},
	{ _id: "3", name: "Set range", range: null },
];

// TODO: column sort
const ReceiptsFilters = (props: any) => {
	const filters = props.filters;
	const [dateType, setDateType] = useState(dateTypeList[0]);
	const [dateRangeActive, setDateRangeActive] = useState(false);
	const [form, setForm] = useState<ReceiptsFilter>({
		dateRange: dateTypeList[0].range,
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

	// on date type change (e.g: last 30 days, last 60 days, date range)
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

	useEffect(() => {
		let timer: any;
		timer = setTimeout(async () => {
			filters.setQuery(form);
			props.handleFilter(filters);
		}, 1000);
		return () => clearTimeout(timer);
	}, [form]);

	return (
		<div
			className={`filters ${props.className || ""}`}
			style={{ ...props.style, ...{ flexDirection: "column", gap: "10px" } }}
		>
			<div style={{ display: "flex", width: "100%", justifyContent: "space-between", gap: "10px" }}>
				<div style={{ display: "flex", gap: "10px" }}>
					<FormGroup row>
						{/* <RadioGroup
							list={sortOrderList}
							selected={form.sort}
							onChange={(v: any) => {
								updateForm({ target: { name: "sort", value: { createdAt: v } } });
							}}
						/> */}
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
				<RadioGroup
					style={{ fontSize: "12px" }}
					list={["ALL", ...Object.keys(RECEIPT_STATUS)].map((item: any) => {
						return { name: item, label: item };
					})}
					selected={form.status}
					onChange={(v: any) => updateForm({ target: { name: "status", value: v } })}
				/>
			</div>
			<span style={{ marginTop: "10px", fontSize: "15px", textAlign: "right" }}>
				Showing{" "}
				<span
					className={`text-info ${props.loading ? "skeleton" : ""}`}
					style={{ fontWeight: 800 }}
				>
					{props.loading ? "" : filters?.itemsCurrent || ""}
				</span>{" "}
				out of{" "}
				<span
					className={`text-info ${props.loading ? "skeleton" : ""}`}
					style={{ fontWeight: 800 }}
				>
					{props.loading ? "" : filters?.itemsTotal || ""}
				</span>{" "}
				result
				{filters?.itemsCurrent ? "s" : ""} from{" "}
				<span
					className={`text-info ${props.loading ? "skeleton" : ""}`}
					style={{ fontWeight: 800, width: "100px" }}
				>
					{props.loading ? "" : DateTime.fromISO(form.dateRange.start).toFormat("LLLL dd, yyyy")}
				</span>{" "}
				to{" "}
				<span
					className={`text-info ${props.loading ? "skeleton" : ""}`}
					style={{ fontWeight: 800, width: "100px" }}
				>
					{props.loading ? "" : DateTime.fromISO(form.dateRange.end).toFormat("LLLL dd, yyyy")}
				</span>
			</span>
		</div>
	);
};

export default ReceiptsFilters;
