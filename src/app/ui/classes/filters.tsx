export class Filters {
	query: string = "";
	limit: string = "10";
	itemsCurrent: string = "0"; // current rendered items
	itemsTotal: string = "0"; // total in db
	page: string = "1"; // current page
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
			sort: this.sort,
			query: this.query,
			limit: this.limit,
			itemsTotal: this.itemsTotal,
			pagesTotal: this.pagesTotal,
			itemsCurrent: this.itemsCurrent,
			page: this.page,
		};
	}

	setQuery(query: any) {
		this.query = query ? JSON.stringify(query) : "";
	}

	getInQuery(param: string) {
		return JSON.parse(this.query)[param];
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
		this.page = (Number(this.page) + 1).toString();
	}

	setPage(page: number) {
		this.page = page.toString();
	}
}
