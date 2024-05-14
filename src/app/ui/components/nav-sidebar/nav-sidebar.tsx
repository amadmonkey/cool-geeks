"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
// import moment from "moment";
import moment from "moment-timezone";
import IconSubd from "../../../../../public/subd.svg";
import IconClock from "../../../../../public/clock2.svg";
import IconAccounts from "../../../../../public/users.svg";
import IconSignOut from "../../../../../public/signout.svg";
import IconReceipt from "../../../../../public/receipt2.svg";
import IconSettings from "../../../../../public/settings.svg";
import IconDashboard from "../../../../../public/dashboard.svg";
import "./nav-sidebar.scss";

const NavSidebar = () => {
	const [activePage, setActivePage] = useState("dashboard");
	const pathname = usePathname();
	const date = moment(new Date()).tz("Asia/Manila");
	const [currentDate, setCurrentDate]: any = useState(null);
	const { push } = useRouter();

	const redirect = (e: any) => {
		e.preventDefault;
		setActivePage(e.target.pathname);
		push(e.target.href);
	};

	useEffect(() => {
		setActivePage(pathname);
	}, [pathname]);

	useEffect(() => {
		const test = setInterval(() => {
			const date = moment(new Date()).tz("Asia/Manila");
			setCurrentDate({
				hours: date.get("hours"),
				minutes: date.get("minutes"),
				seconds: date.get("seconds"),
				dateMonthYear: date.format("MMM Do, YYYY"),
			});
		}, 1000);
		return () => {
			clearTimeout(test);
		};
	}, []);

	return (
		<div className="nav-sidebar">
			<header className="nav-sidebar__header">
				<span>SERVER TIME</span>
				<h1 style={{ display: "flex", flexDirection: "row" }}>
					<time>
						<IconClock />
						{currentDate ? (
							`${currentDate.hours}:${currentDate.minutes < 10 ? "0" : ""}${currentDate.minutes}`
						) : (
							<time className="skeleton" style={{ height: 35 }}>
								&nbsp;
							</time>
						)}
					</time>
					{currentDate && (
						<div>
							<span>
								:{currentDate.seconds < 10 ? "0" : ""}
								{currentDate.seconds}
							</span>
							<span>{currentDate.hours >= 12 ? "pm" : "am"}</span>
						</div>
					)}
				</h1>
				{currentDate ? (
					<time>{currentDate.dateMonthYear}</time>
				) : (
					<time className="skeleton" style={{ height: 20, width: "100%" }}>
						&nbsp;
					</time>
				)}
			</header>
			<ul className="nav-sidebar__list">
				<li className={`${activePage === "/admin" ? "active" : ""}`}>
					<Link href="/admin" className="strip" onClick={redirect}>
						<IconDashboard />
						Dashboard
					</Link>
				</li>
				<li className={`${activePage.includes("/admin/receipts") ? "active" : ""}`}>
					<Link href="/admin/receipts" className="strip" onClick={redirect}>
						<IconReceipt />
						Receipts
					</Link>
				</li>
				<li className={`${activePage.includes("/admin/accounts") ? "active" : ""}`}>
					<Link href="/admin/accounts" className="strip" onClick={redirect}>
						<IconAccounts />
						Accounts
					</Link>
				</li>
				<li className={`${activePage.includes("/admin/subds") ? "active" : ""}`}>
					<Link href="/admin/subds" className="strip" onClick={redirect}>
						<IconSubd />
						Subdivisions
					</Link>
				</li>
				<li className={`${activePage.includes("/admin/settings") ? "active" : ""}`}>
					<Link href="/admin/settings" className="strip" onClick={(e) => redirect(e)}>
						<IconSettings />
						Alert Settings
					</Link>
				</li>
				<li>
					<IconSignOut />
					Logout
				</li>
			</ul>
		</div>
	);
};

export default NavSidebar;
