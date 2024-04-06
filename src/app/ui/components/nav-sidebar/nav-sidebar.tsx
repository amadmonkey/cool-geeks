"use client";
import React from "react";

import "./nav-sidebar.scss";

import SignOut from "../../../../../public/signout.svg";
import IconAccounts from "../../../../../public/users.svg";
import IconPayment from "../../../../../public/payment.svg";
import IconSettings from "../../../../../public/settings.svg";
import IconDashboard from "../../../../../public/dashboard.svg";

const NavSidebar = () => {
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
				<li className="active">
					<IconDashboard />
					Dashboard
				</li>
				<li>
					<IconAccounts />
					Accounts
				</li>
				<li>
					<IconPayment />
					Payments
				</li>
				<li>
					<IconSettings />
					Settings
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
