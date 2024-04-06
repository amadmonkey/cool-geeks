import React from "react";

import "./button.scss";

const Button = (props: any) => {
	return (
		<button
			className={`cg-button ${props.mini ? "mini" : ""} ${props.danger ? "danger" : ""}`}
			type={props.type ? props.type : "button"}
			style={props.style}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
};

export default Button;
