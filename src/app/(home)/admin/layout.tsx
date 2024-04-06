import NavSidebar from "@/app/ui/components/nav-sidebar/nav-sidebar";

import "./layout.scss";

export default function AdminNav({ children }: { children: React.ReactNode }) {
	return (
		<section className="admin-layout" style={{ gap: "20px" }}>
			<NavSidebar />
			<div style={{ maxWidth: "1200px", width: "100%" }}>
				<main>{children}</main>
			</div>
		</section>
	);
}
