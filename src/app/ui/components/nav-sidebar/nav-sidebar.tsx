"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import SignOut from "../../../../../public/signout.svg";
import IconAccounts from "../../../../../public/users.svg";
import IconReceipt from "../../../../../public/receipt.svg";
import IconSettings from "../../../../../public/settings.svg";
import IconDashboard from "../../../../../public/dashboard.svg";
import "./nav-sidebar.scss";

const NavSidebar = () => {
	const [activePage, setActivePage] = useState("dashboard");
	const pathname = usePathname();
	const { push } = useRouter();

	const redirect = (e: any) => {
		e.preventDefault;
		setActivePage(e.target.pathname);
		push(e.target.href);
	};

	useEffect(() => {
		setActivePage(pathname);
	}, [pathname]);

	return (
		<div className="nav-sidebar">
			<header className="nav-sidebar__header">
				<span>SERVER TIME</span>
				<h1 style={{ display: "flex", flexDirection: "row" }}>
					<time>06:92</time>
					<div>
						<span>:55</span>
						<span>am</span>
					</div>
				</h1>
				<time>SEPTEMBER 25, 2024</time>
			</header>
			<ul className="nav-sidebar__list">
				<li className={`${activePage === "/admin" ? "active" : ""}`}>
					<Link href="/admin" className="strip" onClick={redirect}>
						<IconDashboard />
						Dashboard
					</Link>
				</li>
				<li className={`${activePage === "/admin/accounts" ? "active" : ""}`}>
					<Link href="/admin/accounts" className="strip" onClick={redirect}>
						<IconAccounts />
						Accounts
					</Link>
				</li>
				<li className={`${activePage === "/admin/receipts" ? "active" : ""}`}>
					<Link href="/admin/receipts" className="strip" onClick={redirect}>
						<IconReceipt />
						Receipts
					</Link>
				</li>
				<li className={`${activePage === "/admin/settings" ? "active" : ""}`}>
					<Link href="/admin/settings" className="strip" onClick={(e) => redirect(e)}>
						<IconSettings />
						Settings
					</Link>
				</li>
				<li>
					<SignOut />
					Logout
				</li>
			</ul>
		</div>
	);
};

export default NavSidebar;
