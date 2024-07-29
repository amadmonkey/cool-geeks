import React, { useRef } from "react";

import IconLoader from "../../../../../public/loader.svg";
import "./hover-bubble.scss";

const HoverBubble = (props: any) => {
	const bubbleRef = useRef<HTMLDivElement | null>(null);

	return props.disabled ? (
		<>{props.children}</>
	) : (
		<div
			ref={bubbleRef}
			className={`hover-bubble ${props.type || ""}${props.right ? " right" : ""}`}
			style={props.style}
		>
			{props.children}
			<div className="bubble" style={{ top: bubbleRef?.current?.clientHeight }}>
				{props.message === null ? (
					<IconLoader style={{ height: "20px", width: "auto" }} />
				) : (
					props.message
				)}
			</div>
		</div>
	);
};

export default HoverBubble;
