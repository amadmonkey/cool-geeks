import React, { useEffect, useState } from "react";
import Image from "next/image";
import IconLoading from "../../../../../public/loading.svg";

import "./history-table.scss";
import { RECEIPT_STATUS_ICON } from "@/utility";
import ListEmpty from "../table/empty/list-empty";

const HistoryTable = (props: any) => {
	// null = loading
	// [] = empty
	// [...] = show table
	const [filteredList, setFilteredList] = useState<any>(null);
	useEffect(() => {
		setFilteredList(props.list);
	}, [props.list]);

	return filteredList ? (
		filteredList.length ? (
			<table className="history-table">
				<thead className="sr-only">
					<tr>
						<th>Date</th>
						<th>Rate</th>
						<th>Reference Number</th>
						<th>Receipt</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{filteredList.map((item: any, index: number) => {
						return (
							<tr key={index} className={item.status?.toLowerCase()}>
								<td>
									<span className="date">
										{new Date(item.receiptDate).toLocaleString("default", { month: "long" })}&nbsp;
										{new Date(item.receiptDate).toLocaleString("default", { year: "numeric" })}
									</span>
								</td>
								<td>
									<span className="rate">{"1000"}</span>
								</td>
								<td>
									{item.referenceType ? (
										<span className="refNo">
											<Image
												src={item.referenceType && `/${JSON.parse(item.referenceType).name}.png`}
												height={0}
												width={0}
												style={{ height: "20px", width: "auto", marginRight: "10px" }}
												sizes="100vw"
												alt="Picture of the author"
											/>
											{item.referenceNumber}
										</span>
									) : (
										<span>RECEIPT SUBMISSION FAILED</span>
									)}
								</td>
								{item.status !== "FAILED" && (
									<>
										<td>
											<button className="invisible">
												<Image
													src={`/image.svg`}
													height={0}
													width={0}
													style={{ height: "20px", width: "auto", marginRight: "10px" }}
													sizes="100vw"
													alt="Picture of the author"
												/>
											</button>
										</td>
										<td>{RECEIPT_STATUS_ICON(item.status, null)}</td>
									</>
								)}
							</tr>
						);
					})}
				</tbody>
			</table>
		) : (
			<ListEmpty label="NO ENTRIES" />
		)
	) : (
		"LOADING"
	);
};

export default HistoryTable;
