import type { Metadata } from "next";
import { ToastContainer, Bounce } from "react-toastify";
import { raleway } from "./ui/fonts";

import "./globals.scss";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
	title: "Cool Geeks",
	description: "Receipt Tracker",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={raleway.className}>
				{children}
				<ToastContainer
					position="bottom-center"
					autoClose={5000}
					newestOnTop={false}
					closeButton={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					hideProgressBar
					pauseOnHover
					theme="light"
					transition={Bounce}
				/>
				{/* <footer id="main">
					<p>Cool Geeks © 2025 All rights reserved</p>
					<ul id="asd">
						<label htmlFor="asd">Contact us:</label>
						<li>facebook</li>
						<li>instagram</li>
						<li>gmail</li>
					</ul>
				</footer> */}
			</body>
		</html>
	);
}
