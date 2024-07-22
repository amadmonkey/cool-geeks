import Header from "../ui/components/header/header";
import { cookies } from "next/headers";

export default function HeaderLayout({ children }: { children: React.ReactNode }) {
	const cookieStore = cookies();
	return (
		<>
			<Header user={cookieStore.get("user")} />
			<div style={{ padding: "20px", paddingTop: "50px" }}>{children}</div>
		</>
	);
}
