import Header from "../ui/components/header/header";

type User = {
	firstName: string;
	lastName: string;
};
// const res = await fetch("https://api.github.com/repos/vercel/next.js", {
// 	method: "POST",
// 	mode: "cors",
// 	cache: "no-cache",
// 	credentials: "same-origin",
// 	headers: {
// 		"Content-Type": "application/json",
// 	},
// 	redirect: "follow",
// 	referrerPolicy: "no-referrer",
// 	body: JSON.stringify({
// 		accountNumber: "987654321",
// 		email: "",
// 		password: "wootwoot",
// 	}),
// });
// const user: User = await res.json();

export default function HeaderLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			<div style={{ padding: "20px", paddingTop: "50px" }}>{children}</div>
		</>
	);
}
