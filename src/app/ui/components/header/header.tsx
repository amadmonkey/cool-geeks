"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next";
import Link from "next/link";
import Image from "next/image";
import DetectOutsideClick from "../detect-outside-click/detect-outside-click";

import IconHelp from "../../../../../public/help.svg";
import IconContact from "../../../../../public/contact.svg";
import IconSignout from "../../../../../public/signout.svg";
import IconSettings from "../../../../../public/settings.svg";

import "./header.scss";

const Header = () => {
	const { push } = useRouter();
	const user = useRef(JSON.parse(getCookie("user") || ""));
	const [userDropdownActive, setUserDropdownActive] = useState(false);

	const redirect = (e: any) => {
		e.preventDefault;
		setUserDropdownActive(false);
		push(e.target.href);
	};

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
					const { code } = res;
					deleteCookie("user");
					deleteCookie("plan");
					deleteCookie("subd");
					deleteCookie("accessToken");
					deleteCookie("refreshToken");
					push("/login");

					// switch (code) {
					// 	case 200:
					// 		break;
					// 	default:
					// 		push("/login");
					// 		break;
					// }
				});
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<header className="main-header">
			<Link href={"/"} className="logo">
				<Image
					src={`/geek-head.png`}
					height={0}
					width={0}
					sizes="100vw"
					style={{ height: "30px", width: "auto" }}
					alt="Logo head"
				/>
				<Image
					src={`/geek-text.png`}
					height={0}
					width={0}
					sizes="100vw"
					style={{ height: "20px", width: "auto" }}
					alt="Logo text"
				/>
			</Link>
			<DetectOutsideClick action={() => setUserDropdownActive(false)} style={{ display: "flex" }}>
				<div className={`user-details ${userDropdownActive ? "active" : ""}`}>
					<button
						className="user-button"
						onClick={() => setUserDropdownActive(!userDropdownActive)}
					>
						<h1>{`${user.current.firstName} ${user.current.lastName}`}</h1>
						<span>{user.current.subdRef && user.current.subdRef.name}</span>
						<Image
							className="caret"
							src={`/caret.svg`}
							height={0}
							width={0}
							sizes="100vw"
							alt="Dropdown Caret icon"
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
			</DetectOutsideClick>
		</header>
	);
};

export default Header;
