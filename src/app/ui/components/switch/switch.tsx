import React, { useEffect, useState } from "react";

import "./switch.scss";

const Switch = (props: any) => {
	const id = `switch-${props.name}-${props.id}`;
	const [isChecked, setIsChecked] = useState(false);

	const handleOnChange = () => {
		setIsChecked(!isChecked);
		props.onChange();
	};

	useEffect(() => setIsChecked(props.checked), [props.checked]);

	return (
		<div
			className={`switch-container ${props.mini ? "mini" : ""}`}
			style={{
				display: "flex",
				justifyContent: "center",
				gap: 10,
				alignItems: "center",
				height: "30px",
			}}
		>
			<label
				htmlFor={id}
				className="switch-label"
				style={{
					fontSize: "13px",
					display: props.label ? "block" : "none",
					cursor: "pointer",
					fontWeight: 800,
					userSelect: "none",
				}}
			>
				{props.label}
			</label>
			<div className="switch" style={props.style}>
				<input
					name={props.name}
					id={id}
					type="checkbox"
					className="switch-input"
					checked={isChecked}
					onChange={() => handleOnChange()}
				/>
				<label htmlFor={id} className="switch-ui"></label>
				<label htmlFor={id} className="sr-only"></label>
			</div>
			<label htmlFor={id} className="switch-label">
				{isChecked ? props.on || "ON" : props.off || "OFF"}
			</label>
		</div>
	);
};

export default Switch;
