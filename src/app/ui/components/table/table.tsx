import React, { useEffect, useState } from "react";
import Image from "next/image";
import IconLoading from "../../../../../public/loading.svg";

import "./table.scss";

const Table = (props: any) => {
	const [filteredList, setFilteredList] = useState<any>(null);
	// null = loading
	// [] = empty
	// [...] = show table
	useEffect(() => {
		console.log(props.list);
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
							<tr key={index}>
								<td>
									<span className="date">
										{new Date(item.createdAt).toLocaleString("default", { month: "long" })}&nbsp;
										{new Date(item.createdAt).toLocaleString("default", { year: "numeric" })}
									</span>
								</td>
								<td>
									<span className="rate">{"1000"}</span>
								</td>
								<td>
									<span className="refNo">
										<Image
											src={`/${JSON.parse(item.referenceType).name}.png`}
											height={0}
											width={0}
											style={{ height: "20px", width: "auto", marginRight: "10px" }}
											sizes="100vw"
											alt="Picture of the author"
										/>
										{item.referenceNumber}
									</span>
								</td>
								<td>
									<button>
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
								<td>
									<Image
										src={`/${item.status === "DONE" ? "done" : "wait"}.svg`}
										height={0}
										width={0}
										style={{ height: "20px", width: "auto", marginRight: "10px" }}
										sizes="100vw"
										alt="Picture of the author"
									/>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		) : (
			<div className="empty-container">
				<Image
					src={`/leaf.png`}
					height={0}
					width={0}
					style={{ height: "100px", width: "auto" }}
					sizes="100vw"
					alt="Picture of the author"
				/>
				<h1>NO ENTRIES</h1>
			</div>
		)
	) : (
		<div className="empty-container">
			<IconLoading />
		</div>
	);
};

export default Table;
