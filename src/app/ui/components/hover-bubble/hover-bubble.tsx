import React, { useEffect, useRef, useState } from "react";

import "./hover-bubble.scss";

const HoverBubble = (props: any) => {
	const bubbleRef = useRef<HTMLDivElement | null>(null);

	return (
		<div ref={bubbleRef} className={`hover-bubble ${props.type}`} style={props.style}>
			{props.children}
			{props.message && (
				<div className="bubble" style={{ top: bubbleRef?.current?.clientHeight }}>
					{props.message}
				</div>
			)}
		</div>
	);
};

export default HoverBubble;
