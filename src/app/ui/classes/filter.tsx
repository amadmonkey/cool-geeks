export class Filter {
	query: string = "";
	page: string = "1";
	limit: string = "10";
	sort: Object = {
		createdAt: "desc",
	};

	constructor(values?: any) {
		const { query, page, limit, sort } = values || {};

		if (query !== undefined) {
			this.query = JSON.stringify(query);
		}

		if (page !== undefined) {
			this.page = page;
		}
		if (limit !== undefined) {
			this.limit = limit;
		}

		if (sort !== undefined) {
			this.sort = JSON.stringify(sort);
		}
	}

	get values() {
		return {
			filter: JSON.parse(this.query),
			page: this.page,
			limit: this.limit,
			sort: this.sort,
		};
	}

	setQuery(query: any) {
		this.query = query ? JSON.stringify(query) : "";
	}
}
