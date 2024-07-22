"use client";
import React from "react";

import IconLoading from "../../../../public/loading.svg";

const Loading = () => {
	return (
		<div
			style={{ height: "50vh", display: "flex", justifyContent: "center", alignItems: "center" }}
		>
			<IconLoading style={{ width: "100px" }} />
		</div>
	);
};

export default Loading;
