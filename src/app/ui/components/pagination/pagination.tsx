import React, { useEffect, useState } from "react";

// components
import RadioGroup from "../radio-group/radio-group";

// svgs
import IconCaret from "@/public/caret.svg";

// styles
import "./pagination.scss";

const Pagination = (props: any) => {
	const f = props.filters;
	const [pages, setPages] = useState<any>([]);

	useEffect(() => {
		let startPage;
		if (f.page > 3) {
			if (f.page + 2 > Number(f.pagesTotal)) {
				startPage = Number(f.pagesTotal) - 4;
			} else {
				startPage = f.page - 2;
			}
		} else {
			startPage = 1;
		}
		const pages = Array.from({ length: f.pagesTotal }, (_, i) => Number(startPage) + i).map(
			(item: any) => ({ name: item.toString(), label: item.toString() })
		);

		setPages(pages);
	}, [props.page]);

	const updatePage = (newPage: Number) => {
		props.handleFilter({
			target: { name: "page", value: newPage },
		});
	};

	return (
		<div className="pagination">
			{pages.length > 1 && (
				<>
					<button
						disabled={Number(f.page) === 1}
						className="pagination__first invisible"
						onClick={() => updatePage(1)}
					>
						<IconCaret />
						<IconCaret />
					</button>
					<button
						disabled={Number(f.page) === 1}
						className="pagination__previous invisible"
						onClick={() => updatePage(Number(f.page) - 1)}
					>
						<IconCaret />
					</button>
					<RadioGroup
						name={props.name}
						style={{ fontSize: "12px" }}
						list={pages}
						selected={f.page}
						onChange={(v: any) => updatePage(v)}
					/>
					<button
						disabled={Number(f.page) >= Number(f.pagesTotal)}
						className="pagination__next invisible"
						onClick={() => updatePage(Number(f.page) + 1)}
					>
						<IconCaret />
					</button>
					<button
						disabled={Number(f.page) >= Number(f.pagesTotal)}
						className="pagination__last invisible"
						onClick={() => updatePage(f.pagesTotal)}
					>
						<IconCaret />
						<IconCaret />
					</button>
				</>
			)}
		</div>
	);
};

export default Pagination;
