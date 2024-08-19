import Subd from "./Subd";
import User from "./User";

export default interface Plan {
	_id: string;
	subdRef: Subd;
	name: string;
	price: string;
	active: boolean;
	updatedAt: string;
	description: string;
	users: Array<User>;
}
