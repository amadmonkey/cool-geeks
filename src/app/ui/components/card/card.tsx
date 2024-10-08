import React from "react";

import "./card.scss";

const Card = (props: any) => {
	return (
		<div
			style={props.style}
			onMouseEnter={props.onMouseEnter}
			onMouseLeave={props.onMouseLeave}
			className={`cg-card ${props.type || ""} ${props.mini ? "mini" : ""} ${props.className || ""}`}
		>
			{props.children}
		</div>
	);
};

export default Card;
