import React from "react";

import "./switch.scss";

const Switch = (props: any) => {
	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
			<div className="switch" style={props.style}>
				<input id="switch-1" type="checkbox" className="switch-input" />
				<label htmlFor="switch-1" className="switch-label">
					Switch
				</label>
			</div>
			<label htmlFor="switch-1" className="sr-only">
				Switch
			</label>
			<label
				htmlFor="switch-1"
				style={{ fontSize: "13px", display: props.label ? "block" : "none", cursor: "pointer" }}
			>
				{props.label}
			</label>
		</div>
	);
};

export default Switch;
