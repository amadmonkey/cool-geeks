import React from "react";

import "./table.scss";
import Pagination from "../pagination/pagination";

const Table = ({ children, headers, className, type }: any) => {
	return (
		<div className={`cg-table ${type} ${className}`}>
			<table>
				{headers && (
					<thead>
						<tr className={`${type} ${className}`}>
							{Object.keys(headers).map((header, i) => {
								if (header.includes("nbsp")) return <th key={i}>&nbsp;</th>;
								return <th key={i}>{header.split("_").join(" ").toUpperCase()}</th>;
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
