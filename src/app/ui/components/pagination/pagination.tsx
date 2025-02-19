import React from "react";

// components
import RadioGroup from "../radio-group/radio-group";

// svgs
import IconCaret from "@/public/caret.svg";

// styles
import "./pagination.scss";

const Pagination = (props: any) => {
	const f = props.filters;

	return (
		<div className="pagination">
			<button className="pagination__first invisible" disabled>
				<IconCaret />
				<IconCaret />
			</button>
			<button
				className="pagination__previous invisible"
				onClick={() => {
					if (Number(f.pagesCurrent) > 1) {
						f.setPagesCurrent(Number(f.pagesCurrent) - 1);
						props.handleFilter({
							target: { name: "currentPage", value: Number(f.currentPage) - 1 },
						});
					}
				}}
			>
				<IconCaret />
			</button>
			<RadioGroup
				name={props.name}
				style={{ fontSize: "12px" }}
				list={Array.from({ length: f.pagesTotal }, (_, i) => i + 1).map((item: any) => {
					return { name: item.toString(), label: item.toString() };
				})}
				selected={f.pagesCurrent}
				onChange={(v: any) => {
					f.setPagesCurrent(v);
					props.handleFilter({ target: { name: "currentPage", value: v } });
				}}
			/>
			<button
				className="pagination__next invisible"
				onClick={() => {
					// if (Number(f.pagesCurrent) < Number(f.pagesTotal)) {
					f.setPagesCurrent(Number(f.pagesCurrent) + 1);
					props.handleFilter({
						target: { name: "currentPage", value: Number(f.currentPage) + 1 },
					});
					// }
				}}
			>
				<IconCaret />
			</button>
			<button className="pagination__last invisible" disabled>
				<IconCaret />
				<IconCaret />
			</button>
		</div>
	);
};

export default Pagination;
