import User from "./User";

export default interface Plan {
	_id: string;
	name: string;
	price: string;
	active: boolean;
	updatedAt: string;
	description: string;
	users: Array<User>;
}
