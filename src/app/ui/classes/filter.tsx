export class Filter {
	page: string = "1";
	limit: string = "10";
	sortBy: string = "createdAt";
	sortOrder: string = "DESC";
	constructor(values?: any) {
		const { page, limit, sortBy, sortOrder } = values || {};
		if (page !== undefined) {
			this.page = page;
		}
		if (limit !== undefined) {
			this.limit = limit;
		}
		if (sortBy !== undefined) {
			this.sortBy = sortBy;
		}
		if (sortOrder !== undefined) {
			this.sortOrder = sortOrder;
		}
	}
	get values() {
		return {
			page: this.page,
			limit: this.limit,
			sortBy: this.sortBy,
			sortOrder: this.sortOrder,
		};
	}

	set values(obj) {}
}
