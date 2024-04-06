import React from "react";

import "./card.scss";

const Card = (props: any) => {
	return (
		<div style={props.style} className={`cg-card ${props.className ? props.className : ""}`}>
			{props.children}
		</div>
	);
};

export default Card;
