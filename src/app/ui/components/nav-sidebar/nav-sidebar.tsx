"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DateTime } from "luxon";
import { useRouter, usePathname } from "next/navigation";

// svgs
import IconSubd from "../../../../../public/subd.svg";
import IconClock from "../../../../../public/clock2.svg";
import IconAccounts from "../../../../../public/users.svg";
import IconSignOut from "../../../../../public/signout.svg";
import IconReceipt from "../../../../../public/receipt2.svg";
import IconSettings from "../../../../../public/settings.svg";
import IconDashboard from "../../../../../public/dashboard.svg";

// styles
import "./nav-sidebar.scss";

const NavSidebar = () => {
	const { push, refresh } = useRouter();
	const pathname = usePathname();
	const [activePage, setActivePage] = useState("dashboard");
	const [currentDate, setCurrentDate]: any = useState(null);

	const navigate = (e: any, redirect: boolean) => {
		e.preventDefault();
		setActivePage(e.target.pathname);
		redirect && push(e.target.href);
	};

	useEffect(() => {
		setActivePage(pathname);
	}, [pathname]);

	useEffect(() => {
		const timeInterval = setInterval(() => {
			const date = DateTime.local().setZone("Asia/Manila");
			setCurrentDate({
				hours: date.toFormat("hh"),
				minutes: date.minute,
				seconds: date.second,
				dateMonthYear: date.toFormat("LLLL dd, yyyy").toLowerCase(),
				timeOfDay: date.toFormat("a").toLowerCase(),
			});
		}, 200);
		return () => clearTimeout(timeInterval);
	}, []);

	const logout = (e: any) => {
		e.preventDefault();
		try {
			fetch("/api/auth", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			})
				.then((res) => res.json())
				.then((res) => {
					push("/login");
					refresh();
				});
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div className="nav-sidebar">
			<header className="nav-sidebar__header">
				<span>SERVER TIME</span>
				<h1 style={{ display: "flex", flexDirection: "row" }}>
					<time>
						<IconClock />
						{currentDate ? (
							`${currentDate.hours}:${currentDate.minutes}`
						) : (
							<time className="skeleton" style={{ height: 35 }}>
								&nbsp;
							</time>
						)}
					</time>
					{currentDate && (
						<div>
							<span>:{currentDate.seconds}</span>
							<span>{currentDate.timeOfDay}</span>
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
			{activePage && (
				<ul className="nav-sidebar__list">
					<li className={`${activePage === "/admin" ? "active" : ""}`}>
						<Link href="/admin" className="strip" onClick={(e: any) => navigate(e, true)}>
							<IconDashboard />
							<span>Dashboard</span>
						</Link>
					</li>
					<li className={`${activePage.includes("/admin/receipts") ? "active" : ""}`}>
						<Link href="/admin/receipts" className="strip" onClick={(e: any) => navigate(e, true)}>
							<IconReceipt />
							<span>Receipts</span>
						</Link>
					</li>
					<li className={`${activePage.includes("/admin/accounts") ? "active" : ""}`}>
						<Link href="/admin/accounts" className="strip" onClick={(e: any) => navigate(e, false)}>
							<IconAccounts />
							<span>Accounts</span>
						</Link>
						<ul className="__pages __pages__accounts">
							<li className={`${pathname === "/admin/accounts" ? "active" : ""}`}>
								<Link href="/admin/accounts">List</Link>
							</li>
							<li className={`${pathname === "/admin/accounts/create" ? "active" : ""}`}>
								<Link href="/admin/accounts/create">New Account</Link>
							</li>
						</ul>
					</li>
					<li className={`${activePage.includes("/admin/subds") ? "active" : ""}`}>
						<Link href="/admin/subds" className="strip" onClick={(e: any) => navigate(e, false)}>
							<IconSubd />
							<span>Subdivisions</span>
						</Link>
						<ul className="__pages __pages__subds">
							<li className={`${pathname === "/admin/subds" ? "active" : ""}`}>
								<Link href="/admin/subds">List</Link>
							</li>
							<li className={`${pathname === "/admin/subds/create" ? "active" : ""}`}>
								<Link href="/admin/subds/create">New Subd</Link>
							</li>
						</ul>
					</li>
					<li className={`${activePage.includes("/admin/settings") ? "active" : ""}`}>
						<Link href="/admin/settings" className="strip" onClick={(e: any) => navigate(e, false)}>
							<IconSettings />
							<span>Settings</span>
						</Link>
						<ul className="__pages __pages__settings">
							<li>
								<Link href="/admin/settings">Account Settings</Link>
							</li>
							<li>
								<Link href="/admin/settings">App Settings</Link>
							</li>
							<li>
								<Link href="/admin/settings">Notification Settings</Link>
							</li>
						</ul>
					</li>
					<li>
						<button
							style={{ display: "flex", color: "#fff", gap: 5, alignItems: "center", fontSize: 14 }}
							className="invisible"
							onClick={logout}
						>
							<IconSignOut />
							Logout
						</button>
					</li>
				</ul>
			)}
		</div>
	);
};

export default NavSidebar;
