import Plan from "./Plan";
import User from "./User";

export default interface Receipt {
	_id: string;
	userRef: User;
	planRef: Plan;
	label: string;
	receiptName: string;
	receiptDate: string;
	status: string;
	cutoff: string;
	referenceNumber: string;
	referenceType: ReferenceType;
	rejectReason: string | null;
	createdAt: string;
	updatedAt: string;
}

type ReferenceType = {
	id: string;
	name: string;
	icon: string;
};
