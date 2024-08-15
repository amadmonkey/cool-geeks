import React from "react";

// svgs
import IconLoader from "@/public/loader.svg";

// styles
import "./button.scss";

const Button = (props: any) => {
	return (
		<button
			name={props.name}
			className={`cg-button ${props.className || ""}${props.mini ? " mini" : ""}${
				props.danger ? " bg-danger" : ""
			}${props.success ? " bg-success" : ""}${props.info ? " bg-info" : ""}`}
			type={props.type || "button"}
			style={props.style}
			onClick={!props.disabled && props.onClick}
			disabled={props.disabled || props.loading ? true : false}
		>
			{props.loading ? <IconLoader className="button-loader" /> : props.children}
		</button>
	);
};

export default Button;
