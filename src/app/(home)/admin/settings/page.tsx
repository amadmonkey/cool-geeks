"use client";

import { useEffect, useState } from "react";
import { PRE, SKELETON_TYPES, STRING_UTILS } from "@/utility";
import { useRouter } from "next/navigation";

import IconLoader from "@/public/loading.svg";
import InlineEditInput from "@/app/ui/components/inline-edit-input/inline-edit-input";

import "./page.scss";

export default function Settings() {
	const { push } = useRouter();
	const [settings, setSettings] = useState<any>(null);

	const searchOptions = new URLSearchParams({
		sort: JSON.stringify({
			name: "asc",
		}),
	});

	const fetchSettings = async () => {
		const { code, data } = await fetch(`/api/settings`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		}).then((res) => res.json());

		switch (code) {
			case 200:
				setSettings(data);
				break;
			case 401:
				push("/login");
				break;
			default:
				console.log("get subds default", data);
				push("/login");
				break;
		}
	};

	useEffect(() => {
		fetchSettings();
	}, []);

	return settings ? (
		<div className="content__subd">
			<div>
				{settings.map((settings: any) => {
					return (
						<div key={settings._id} className="setting-group">
							<span>{settings.name}</span>

							<InlineEditInput
								name="code"
								type="text"
								minLength="1"
								maxLength="3"
								placeholder="Code"
								inputStyle={{ width: "150px", textAlign: "center", fontSize: "19px" }}
								value={settings.value}
								onChange={() => console.log("change setting")}
								onSubmit={() => console.log("update setting")}
								action={() => console.log("back to default")}
							>
								<span className="code">{settings.value}</span>
							</InlineEditInput>
						</div>
					);
				})}
			</div>
			{PRE(settings)}
		</div>
	) : (
		<IconLoader style={{ margin: "100px auto 0 auto", width: "100px" }} />
	);
}
