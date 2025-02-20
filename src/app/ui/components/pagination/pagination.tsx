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
			<button
				className="pagination__first invisible"
				onClick={() => {
					if (Number(f.pagesCurrent) > 1) {
						f.setPagesCurrent(1);
						props.handleFilter({
							target: { name: "pagesCurrent", value: 1 },
						});
					}
				}}
			>
				<IconCaret />
				<IconCaret />
			</button>
			<button
				className="pagination__previous invisible"
				onClick={() => {
					if (Number(f.pagesCurrent) > 1) {
						const newPage = Number(f.pagesCurrent) - 1;
						f.setPagesCurrent(newPage);
						props.handleFilter({
							target: { name: "pagesCurrent", value: newPage.toString() },
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
					console.log(v);
					f.setPagesCurrent(v);
					props.handleFilter({ target: { name: "pagesCurrent", value: v } });
				}}
			/>
			<button
				className="pagination__next invisible"
				onClick={(v: any) => {
					if (Number(f.pagesCurrent) < Number(f.pagesTotal)) {
						const newPage = Number(f.pagesCurrent) + 1;
						f.setPagesCurrent(newPage);
						props.handleFilter({
							target: { name: "pagesCurrent", value: newPage },
						});
					}
				}}
			>
				<IconCaret />
			</button>
			<button
				className="pagination__last invisible"
				onClick={() => {
					if (Number(f.pagesCurrent) < Number(f.pagesTotal)) {
						f.setPagesCurrent(String(f.pagesTotal));
						props.handleFilter({
							target: { name: "pagesCurrent", value: String(f.pagesTotal) },
						});
					}
				}}
			>
				<IconCaret />
				<IconCaret />
			</button>
		</div>
	);
};

export default Pagination;
