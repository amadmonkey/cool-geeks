import React, { useEffect, useState } from "react";

// components
import RadioGroup from "../radio-group/radio-group";

// svgs
import IconCaret from "@/public/caret.svg";

// styles
import "./pagination.scss";

const Pagination = (props: any) => {
	const f = props.filters;
	const [pagesCurrent, setPagesCurrent] = useState<Number>(1);
	const [pages, setPages] = useState<any>([]);

	useEffect(() => {
		let startPage;
		console.log("f.pagesCurrent", f.pagesCurrent);

		if (f.pagesCurrent > 3) {
			if (Number(f.pagesCurrent) + 2 > Number(f.pagesTotal)) {
				startPage = Number(f.pagesTotal) - 4;
			} else {
				startPage = Number(f.pagesCurrent) - 2;
			}
		} else {
			startPage = 1;
		}

		const pages = Array.from({ length: f.pagesTotal }, (_, i) => Number(startPage) + i).map(
			(item: any) => {
				console.log(item);
				return { name: item.toString(), label: item.toString() };
			}
		);

		setPages(pages);
	}, [pagesCurrent]);

	const updatePage = (newPage: Number) => {
		f.setPagesCurrent(newPage);
		setPagesCurrent(newPage);
		props.handleFilter({
			target: { name: "pagesCurrent", value: newPage },
		});
	};

	return (
		<div className="pagination">
			<button
				disabled={Number(f.pagesCurrent) === 1}
				className="pagination__first invisible"
				onClick={() => updatePage(1)}
			>
				<IconCaret />
				<IconCaret />
			</button>
			<button
				disabled={Number(f.pagesCurrent) === 1}
				className="pagination__previous invisible"
				onClick={() => updatePage(Number(f.pagesCurrent) - 1)}
			>
				<IconCaret />
			</button>
			<RadioGroup
				name={props.name}
				style={{ fontSize: "12px" }}
				list={pages}
				selected={f.pagesCurrent}
				onChange={(v: any) => updatePage(v)}
			/>
			<button
				disabled={Number(f.pagesCurrent) >= Number(f.pagesTotal)}
				className="pagination__next invisible"
				onClick={() => updatePage(Number(f.pagesCurrent) + 1)}
			>
				<IconCaret />
			</button>
			<button
				disabled={Number(f.pagesCurrent) >= Number(f.pagesTotal)}
				className="pagination__last invisible"
				onClick={() => updatePage(f.pagesTotal)}
			>
				<IconCaret />
				<IconCaret />
			</button>
		</div>
	);
};

export default Pagination;
