import React, { useState } from "react";

import "./table.scss";

const Table = ({ children, headers, className }: any) => {
	return (
		<div className={`cg-table ${className}`}>
			<table>
				<thead>
					<tr className={className}>
						{Object.keys(headers).map((header, i) => {
							if (header.includes("nbsp")) return <th key={i}>&nbsp;</th>;
							return <th key={i}>{header.split("_").join(" ").toUpperCase()}</th>;
						})}
					</tr>
				</thead>
				<tbody>{children}</tbody>
			</table>
		</div>
	);
};

export default Table;
