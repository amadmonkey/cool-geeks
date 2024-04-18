import React, { useEffect, useRef } from "react";

function OnOutsideClick(ref: any, props: any) {
	useEffect(() => {
		const handleClickOutside = (event: any) => {
			if (ref.current && !ref.current.contains(event.target)) {
				props.action();
			}
		};
		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref, props]);
}

function DetectOutsideClick(props: any) {
	const ref = useRef(null);
	OnOutsideClick(ref, props);

	return (
		<div ref={ref} style={{ ...props.style }}>
			{props.children}
		</div>
	);
}

export default DetectOutsideClick;
