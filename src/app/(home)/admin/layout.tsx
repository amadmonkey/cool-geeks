import NavSidebar from "@/app/ui/components/nav-sidebar/nav-sidebar";

import "./layout.scss";

export default function AdminNav({ children }: { children: React.ReactNode }) {
	return (
		<section className="admin-layout">
			<NavSidebar />
			<div style={{ maxWidth: "1000px", width: "100%" }}>
				<main>{children}</main>
			</div>
		</section>
	);
}
