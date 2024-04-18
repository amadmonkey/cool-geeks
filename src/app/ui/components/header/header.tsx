"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import Link from "next/link";
import Image from "next/image";
import OutsideAlerter from "../detect-outside-click/detect-outside-click";
import IconHelp from "../../../../../public/help.svg";
import IconContact from "../../../../../public/contact.svg";
import IconSignout from "../../../../../public/signout.svg";
import IconSettings from "../../../../../public/settings.svg";
import "./header.scss";

const Header = () => {
	const [userDropdownActive, setUserDropdownActive] = useState(false);
	const { push } = useRouter();
	// const user = JSON.parse(getCookie("user")!);
	const userRef = useRef(JSON.parse(getCookie("user")!));
	const user = userRef.current;
	console.log("user", user);

	// const user = {
	// 	name: "Manny Villar",
	// 	branch: "Pilar Exclusive",
	// };

	const admin = {
		name: "Admin",
		branch: "Admin",
	};

	const redirect = (e: any) => {
		e.preventDefault;
		setUserDropdownActive(false);
		push(e.target.href);
	};

	const logout = async () => {
		const { code } = await fetch("/api/user", {
			method: "DELETE",
			headers: {},
			credentials: "include",
		}).then((res) => res.json());
		switch (code) {
			case 200:
				push("/login");
				break;
			default:
				push("/login");
				break;
		}
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
			<OutsideAlerter action={() => setUserDropdownActive(false)} style={{ display: "flex" }}>
				<div className={`user-details ${userDropdownActive ? "active" : ""}`}>
					<button
						className="user-button"
						onClick={() => setUserDropdownActive(!userDropdownActive)}
					>
						<h1>{`${user.firstName} ${user.lastName}`}</h1>
						<span>{user.subdRef && user.subdRef.name}</span>
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
								<Link href="/admin" onClick={logout}>
									<IconSignout className="icon" />
									Sign out
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</OutsideAlerter>
		</header>
	);
};

export default Header;
