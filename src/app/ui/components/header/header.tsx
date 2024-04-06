"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

import IconHelp from "../../../../../public/help.svg";
import IconContact from "../../../../../public/contact.svg";
import IconSignout from "../../../../../public/signout.svg";
import IconSettings from "../../../../../public/settings.svg";

import "./header.scss";

const Header = () => {
	const [userDropdownActive, setUserDropdownActive] = useState(false);
	const { push } = useRouter();
	const pathname = usePathname();

	const user = {
		name: "Manny Villar",
		branch: "Pilar Exclusive",
	};

	const admin = {
		name: "Admin",
		branch: "Admin",
	};

	const redirect = (e: any) => {
		setUserDropdownActive(false);
		// const link = e.currentTarget;
		// switch (link.outerText.toLowerCase().trim().replace(/\s/g, "")) {
		// 	case "signout":
		// 		push(link.currentTarget.pathname);
		// 		break;
		// 	default:
		// 		break;
		// }
		// setUserDropdownActive(false);
	};

	return (
		<header>
			<Link href={"/"} className="logo">
				<Image
					src={`/geek-head.png`}
					height={0}
					width={0}
					sizes="100vw"
					style={{ height: "30px", width: "auto" }}
					alt="Picture of the author"
				/>
				<Image
					src={`/geek-text.png`}
					height={0}
					width={0}
					sizes="100vw"
					style={{ height: "20px", width: "auto" }}
					alt="Picture of the author"
				/>
			</Link>
			<div className={`user-details ${userDropdownActive ? "active" : ""}`}>
				<button className="user-button" onClick={() => setUserDropdownActive(!userDropdownActive)}>
					<h1>{pathname === "/admin" ? admin.name : user.name}</h1>
					<span>{pathname === "/admin" ? admin.branch : user.branch}</span>
					<Image
						className="caret"
						src={`/caret.svg`}
						height={0}
						width={0}
						sizes="100vw"
						alt="Picture of the author"
					/>
				</button>
				<div className="user-option-list">
					<ul>
						<li>
							<Link href="" onClick={redirect}>
								<IconSettings className="icon" />
								Account settings
							</Link>
						</li>
						<li>
							<Link href="" onClick={redirect}>
								<IconHelp className="icon" />
								Help
							</Link>
						</li>
						<li>
							<Link href="" onClick={redirect}>
								<IconContact className="icon" />
								Contact us
							</Link>
						</li>
						<li>
							<Link href="/admin" onClick={redirect}>
								<IconSignout className="icon" />
								Sign out
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</header>
	);
};

export default Header;
