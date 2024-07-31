import { Metadata } from "next";
import NavSidebar from "@/app/ui/components/nav-sidebar/nav-sidebar";

import "./layout.scss";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Dashboard",
};

export default function AdminNav({ children }: { children: React.ReactNode }) {
	return (
		<section className="admin-layout">
			<NavSidebar />
			<main style={{ maxWidth: "1200px", width: "100%" }}>{children}</main>
		</section>
	);
}
