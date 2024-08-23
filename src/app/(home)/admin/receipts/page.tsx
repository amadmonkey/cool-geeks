"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VIEW_MODES, TABLE_HEADERS, RECEIPT_STATUS, SKELETON_TYPES } from "@/utility";

// components
import Receipt from "@/app/ui/types/Receipt";
import ReceiptsFilters from "./filters/filters";
import Table from "@/app/ui/components/table/table";
import Section from "@/app/ui/components/section/section";
import Skeleton from "@/app/ui/components/skeleton/skeleton";
import FormGroup from "@/app/ui/components/form-group/form-group";
import ReceiptTr from "@/app/ui/components/receipt-tr/receipt-tr";
import ListEmpty from "@/app/ui/components/table/empty/list-empty";
import RadioGroup from "@/app/ui/components/radio-group/radio-group";
import ReceiptCard from "@/app/ui/components/receipt-card/receipt-card";

// svgs
import IconGrid from "@/public/grid.svg";
import IconList from "@/public/list.svg";
import IconReceipt from "@/public/receipt2.svg";

// types
import { Filters } from "@/app/ui/classes/filters";

// styles
import "./page.scss";

// TODO: segregate
export default function Receipts(props: any) {
	const { push } = useRouter();
	const signal = useRef<any>();
	const mounted = useRef(false);
	const controller = useRef<any>();
	const listRef = useRef<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [viewMode, setViewMode] = useState(props.viewMode || VIEW_MODES.GRID);
	const [, setList] = useState<any>(null); // TODO: hacky shit. find another way. keep in mind
	const [filters] = useState(
		new Filters(
			props.searchOptions || {
				page: "1",
				limit: "9",
				sort: {
					createdAt: "desc",
				},
			}
		)
	);

	const getHistoryList = useCallback(
		async (fromFilter?: boolean, query?: any) => {
			try {
				listRef.current = null;
				setList(null);
				setLoading(true);

				// reset list when something in the filter changed
				if (fromFilter) {
					listRef.current = [];
					filters.setPagesCurrent(1);
					filters.setItemsCurrent(0);
				}

				// if has db query, set it
				if (query) {
					filters.setQuery(query);
					filters.setSort({ createdAt: query.sortOrder });
				}

				// abort previous calls
				if (controller.current) controller.current.abort();
				controller.current = new AbortController();
				signal.current = controller.current.signal;

				const { code, data } = await fetch(
					`/api/receipt?${new URLSearchParams(filters.valuesString)}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
						signal: signal.current,
						credentials: "include",
					}
				).then((res) => res.json());

				switch (code) {
					case 200:
						if (mounted.current) {
							const { list, totalCount } = data;
							filters.setItemsTotal(totalCount);
							filters.addItemsCurrent(list.length);
							listRef.current = listRef.current ? [...listRef.current, ...list] : list;
							setList(list);
						}
						break;
					case 401:
						push("/login");
						break;
					default:
						console.log("getHistoryList default", data);
						push("/login");
						break;
				}

				setLoading(false);
			} catch (err: any) {
				setLoading(false);
				if (err.name === "AbortError") return;
				console.log(err);
			}
		},
		[filters]
	);

	let timeoutId = useRef<number>();

	const onScroll = useCallback(() => {
		const el = document.documentElement;

		clearTimeout(timeoutId.current);
		if (Number(filters.pagesCurrent) >= Number(filters.pagesTotal)) return;
		timeoutId.current = window.setTimeout(() => {
			if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
				filters.incrementPage();
				getHistoryList();
			}
		}, 300);
	}, [filters]);

	useEffect(() => {
		mounted.current = true;
		props.title ? getHistoryList() : window.addEventListener("scroll", onScroll);
		return () => {
			mounted.current = false;
			!props.title && window.removeEventListener("scroll", onScroll);
		};
	}, []);

	return (
		<Section title={sectionTitle(props.title)} others={sectionOthers(viewMode, setViewMode)}>
			{!props.title && (
				<ReceiptsFilters
					filters={filters}
					handleFilter={getHistoryList}
					style={{ marginBottom: "10px" }}
				/>
			)}
			{(() => {
				const isLoading = listRef.current === null || loading;
				switch (viewMode) {
					case VIEW_MODES.GRID:
						return (
							<div
								className={`receipt-cards-container ${viewMode.toLowerCase()}${
									isLoading ? " loading" : listRef.current.length === 0 ? " empty" : ""
								}`}
							>
								{isLoading ? (
									<Skeleton type={SKELETON_TYPES.RECEIPT_CARD} />
								) : listRef.current.length ? (
									listRef.current
										.slice(0, listRef.current.length)
										.map((item: Receipt) => (
											<ReceiptCard
												key={item._id}
												data={item}
												updateConfirmTemplate={updateConfirmTemplate}
											/>
										))
								) : (
									<ListEmpty label="No entries found" />
								)}
								{/* view more skeleton */}
								{!props.title && Number(filters.pagesCurrent) < Number(filters.pagesTotal) && (
									<Skeleton type={SKELETON_TYPES.RECEIPT_CARD} />
								)}
							</div>
						);
					case VIEW_MODES.LIST:
						return (
							<Table
								type="receipts"
								headers={TABLE_HEADERS.receipts}
								className={isLoading ? "loading" : ""}
							>
								{isLoading ? (
									<tr>
										<Skeleton type={SKELETON_TYPES.RECEIPTS} />
									</tr>
								) : listRef.current.length ? (
									listRef.current?.map((item: any) => {
										return (
											<ReceiptTr
												key={item._id}
												data={item}
												updateConfirmTemplate={updateConfirmTemplate}
											/>
										);
									})
								) : (
									<tr style={{ backgroundColor: "unset", boxShadow: "unset" }}>
										<td>
											<ListEmpty label="No entries found" />
										</td>
									</tr>
								)}
							</Table>
						);
				}
			})()}
			{props.title && (
				<Link
					className="button"
					href="/admin/receipts"
					style={{ marginTop: "20px", letterSpacing: 5, fontSize: 11, textAlign: "center" }}
				>
					VIEW MORE
				</Link>
			)}
		</Section>
	);
}

const sectionTitle = (title: string) => (
	<>
		<IconReceipt />
		{title || "Receipts"}
	</>
);

interface updateReceiptTemplateProps {
	data: Object;
	action: string;
}

const updateConfirmTemplate = (
	props: updateReceiptTemplateProps,
	rejectReason: string,
	setRejectReason: Function
) => {
	return (
		props && (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				{props.action === RECEIPT_STATUS.PENDING ? (
					<>
						<h1 style={{ fontSize: "14px", marginBottom: "10px" }}>REMOVE STATUS</h1>
						<p style={{ fontSize: "14px", textAlign: "center", margin: "10px" }}>
							This will set this receipt`s status back to <strong>PENDING</strong>
						</p>
						<p style={{ fontSize: "14px", margin: "10px 0" }}>Continue?</p>
					</>
				) : (
					<>
						<h1 style={{ fontSize: "14px", marginBottom: "10px" }}>UPDATING RECEIPT STATUS</h1>
						<p style={{ fontSize: "14px", textAlign: "center", margin: "10px" }}>
							This will set the receipt`s status to{" "}
							<strong
								className={
									props.action === RECEIPT_STATUS.ACCEPTED ? "text-success" : "text-danger"
								}
							>
								{props.action}
							</strong>
						</p>
						{props.action === RECEIPT_STATUS.DENIED && (
							<FormGroup
								label={
									<span>
										Reason <span>(Optional)</span>
									</span>
								}
								style={{ width: "100%", margin: "20px" }}
							>
								<textarea
									onChange={(e: any) => setRejectReason(e.target.value)}
									value={rejectReason}
								/>
							</FormGroup>
						)}
						<p style={{ fontSize: "14px", margin: "10px 0" }}>Continue?</p>
					</>
				)}
			</div>
		)
	);
};

const sectionOthers = (viewMode: any, setViewMode: any) => (
	<RadioGroup
		list={Object.keys(VIEW_MODES).map((mode) => {
			switch (mode) {
				case VIEW_MODES.GRID:
					return {
						name: VIEW_MODES.GRID,
						label: <IconGrid style={{ height: 30, width: "auto" }} />,
					};
				case VIEW_MODES.LIST:
					return {
						name: VIEW_MODES.LIST,
						label: <IconList style={{ height: 30, width: "auto" }} />,
					};
				// case VIEW_MODES.CAROUSEL:
				// 	return {
				// 		name: VIEW_MODES.CAROUSEL,
				// 		label: <IconCarousel style={{ height: 27, width: "auto" }} />,
				// 	};
				default:
					console.error("MODE NOT FOUND");
					break;
			}
		})}
		selected={viewMode}
		onChange={(newValue: any) => setViewMode(newValue)}
	/>
);
