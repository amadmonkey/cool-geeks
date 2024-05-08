import React, { useEffect, useRef, useState } from "react";

import "./magnifier.scss";

const Magnifier = (props: any) => {
	const zoomLevel = 3;
	const [img, setImage] = useState(props.imageRef);
	const magnifierRef = useRef<HTMLDivElement>(null);
	const hasImage = img.current && !img.current.src.includes("file-upload.svg");

	// https://www.w3schools.com/howto/howto_js_image_magnifier_glass.asp
	useEffect(() => {
		if (hasImage && !props.disabled) {
			let w,
				h,
				bw = 0;

			w = magnifierRef.current!.offsetWidth / 2;
			h = magnifierRef.current!.offsetHeight / 2;

			const moveMagnifier = (e: any) => {
				e.preventDefault(); /*prevent any other actions that may occur when moving over the image*/
				e.stopPropagation();
				if (magnifierRef.current) {
					let { x, y } = getCursorPos(e);

					if (x > img.current.width - w! / zoomLevel!) x = img.current.width - w! / zoomLevel!;
					if (x < w! / zoomLevel) x = w! / zoomLevel;
					if (y > img.current.height - h! / zoomLevel) y = img.current.height - h! / zoomLevel;
					if (y < h! / zoomLevel) y = h! / zoomLevel;

					magnifierRef.current!.style.left = `${x - w!}px`;
					magnifierRef.current!.style.top = `${y - h!}px`;
					magnifierRef.current!.style.backgroundPosition = `-${x * zoomLevel - w! + bw!}px -${
						y * zoomLevel - h! + bw!
					}px`;

					if (
						`-${x * zoomLevel - w! + bw!}` === "-0" ||
						`-${x * zoomLevel - w! + bw!}` ===
							`-${(img.current!.offsetWidth - 25) * zoomLevel - w! + bw!}` ||
						`-${y * zoomLevel - h! + bw!}` === "-0" ||
						`-${y * zoomLevel - h! + bw!}` === "-600"
					) {
						magnifierRef.current!.style.opacity = "0";
					} else {
						magnifierRef.current!.style.opacity = "1";
					}
				}
			};

			magnifierRef.current!.style.backgroundImage = `url("${img.current.src}")`;
			magnifierRef.current!.style.backgroundRepeat = "no-repeat";
			magnifierRef.current!.style.backgroundSize = `auto ${img.current.clientHeight * zoomLevel}px`;

			/*execute a function when someone moves the magnifier glass over the image:*/
			magnifierRef.current!.addEventListener("mousemove", moveMagnifier);
			img.current.addEventListener("mousemove", moveMagnifier);
			/*and also for touch screens:*/
			magnifierRef.current!.addEventListener("touchmove", moveMagnifier);
			img.current.addEventListener("touchmove", moveMagnifier);

			const getCursorPos = (e: any) => {
				let a,
					x = 0,
					y = 0;
				e = e || window.event;
				/*get the x and y positions of the image:*/
				a = img.current.getBoundingClientRect();
				/*calculate the cursor's x and y coordinates, relative to the image:*/
				x = e.pageX - a.left;
				y = e.pageY - a.top;
				/*consider any page scrolling:*/
				x = x - window.scrollX;
				y = y - window.scrollY;
				return { x: x, y: y };
			};
		}
	}, [img, hasImage]);

	return (
		<div className="magnifier-container">
			{hasImage && (
				<div
					className={`magnifier-glass ${props.disabled ? "disabled" : ""}`}
					ref={magnifierRef}
				></div>
			)}
			{props.children}
		</div>
	);
};

export default Magnifier;
