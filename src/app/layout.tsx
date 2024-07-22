import type { Metadata } from "next";
import Head from "next/head";
import { ToastContainer, Bounce } from "react-toastify";

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
			<Head>
				<title>asdasd</title>
			</Head>
			<body className="antialiased">
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
			</body>
		</html>
	);
}
