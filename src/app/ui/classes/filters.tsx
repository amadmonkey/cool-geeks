export class Filters {
	query: string = "";
	limit: string = "10";
	itemsCurrent: string = "0"; // current rendered items
	itemsTotal: string = "0"; // total in db
	pagesCurrent: string = "1"; // current page
	pagesTotal: string = "1"; // current items total / limit
	sort: string = JSON.stringify({
		createdAt: "desc",
	});

	constructor(values?: any) {
		const { query, limit, itemsCurrent, itemsTotal, sort } = values || {};
		if (query !== undefined) this.query = JSON.stringify(query);
		if (limit !== undefined) this.limit = limit;
		if (itemsTotal !== undefined) this.itemsTotal = itemsTotal;
		if (itemsCurrent !== undefined) this.itemsCurrent = itemsCurrent;
		if (sort !== undefined) this.sort = JSON.stringify(sort);
	}

	get valuesString() {
		return {
			query: this.query,
			limit: this.limit,
			itemsTotal: this.itemsTotal,
			itemsCurrent: this.itemsCurrent,
			pagesTotal: this.pagesTotal,
			pagesCurrent: this.pagesCurrent,
			sort: this.sort,
		};
	}

	setQuery(query: any) {
		this.query = query ? JSON.stringify(query) : "";
	}

	setItemsCurrent(count: number) {
		this.itemsCurrent = count.toString();
	}

	addItemsCurrent(count: number) {
		this.itemsCurrent = (Number(this.itemsCurrent) + count).toString();
	}

	setItemsTotal(count: number) {
		this.itemsTotal = count.toString();
		this.pagesTotal = Math.ceil(count / Number(this.limit)).toString();
	}

	setSort(sort: Object) {
		this.sort = JSON.stringify(sort);
	}

	incrementPage() {
		this.pagesCurrent = (Number(this.pagesCurrent) + 1).toString();
	}

	setPagesCurrent(page: number) {
		this.pagesCurrent = page.toString();
	}
}
