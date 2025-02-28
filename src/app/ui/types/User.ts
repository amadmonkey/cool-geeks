import Plan from "./Plan";
import Subd from "./Subd";

export default interface User {
	accountNumber: string;
	firstName: string;
	middleName: string;
	lastName: string;
	address: string;
	contactNo: string;
	email: string;
	cutoff: string;
	admin: boolean;
	status: string;
	activated: boolean;
	subdRef: Subd;
	planRef: Plan;
	createdAt: string;
	updatedAt: string;
}
