import React from "react";

import "./table.scss";

const Table = ({ children, headers, className, type, handleSort }: any) => {
	return (
		<div className={`cg-table ${type} ${className}`}>
			<table>
				{headers && (
					<thead>
						<tr className={`${type} ${className}`}>
							{Object.keys(headers).map((header, i) => {
								if (header.includes("nbsp")) return <th key={i}>&nbsp;</th>;
								return (
									<th key={i}>
										<button className="invisible" onClick={() => handleSort(headers[header])}>
											{header.split("_").join(" ").toUpperCase()}
										</button>
									</th>
								);
							})}
						</tr>
					</thead>
				)}
				<tbody>{children}</tbody>
			</table>
			{/* <Pagination /> */}
		</div>
	);
};

export default Table;
