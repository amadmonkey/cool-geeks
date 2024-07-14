"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { deleteCookie } from "cookies-next";
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
	const { push } = useRouter();
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
			const date = moment(new Date()).tz("Asia/Manila");
			const hours = date.get("hours");
			const r = hours % 12;
			setCurrentDate({
				hours: `${r === 0 ? "" : r < 10 ? 0 : ""}${r === 0 ? 12 : r}`,
				minutes: `${date.get("minutes") < 10 ? 0 : ""}${date.get("minutes")}`,
				seconds: `${date.get("seconds") < 10 ? 0 : ""}${date.get("seconds")}`,
				dateMonthYear: date.format("MMM Do, YYYY"),
				timeOfDay: hours >= 12 ? "pm" : "am",
			});
		}, 200);
		return () => clearTimeout(timeInterval);
	}, []);

	const logout = async () => {
		try {
			await fetch("/api/user", {
				method: "DELETE",
				headers: {},
				credentials: "include",
			})
				.then((res) => res.json())
				.then((res) => {
					// currently deletes all cookies then redirects
					// to login regardless if success or not
					deleteCookie("user");
					deleteCookie("plan");
					deleteCookie("subd");
					deleteCookie("accessToken");
					deleteCookie("refreshToken");
					push("/login");
				});
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {}, []);

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
			<ul className="nav-sidebar__list">
				<li className={`${activePage === "/admin" ? "active" : ""}`}>
					<Link href="/admin" className="strip" onClick={(e: any) => navigate(e, true)}>
						<IconDashboard />
						Dashboard
					</Link>
				</li>
				<li className={`${activePage.includes("/admin/receipts") ? "active" : ""}`}>
					<Link href="/admin/receipts" className="strip" onClick={(e: any) => navigate(e, true)}>
						<IconReceipt />
						Receipts
					</Link>
				</li>
				<li className={`${activePage.includes("/admin/accounts") ? "active" : ""}`}>
					<Link href="/admin/accounts" className="strip" onClick={(e: any) => navigate(e, false)}>
						<IconAccounts />
						Accounts
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
						Subdivisions
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
						Settings
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
		</div>
	);
};

export default NavSidebar;
