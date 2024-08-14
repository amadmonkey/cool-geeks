export default interface Subd {
	_id: string;
	gdriveId: string;
	name: string;
	code: string;
	plans: {};
	qr: Qr;
	number: string;
	active: Boolean;
	createdAt: string;
	updatedAt: string;
}

type Qr = {
	filename: string;
	contentType: string;
};
