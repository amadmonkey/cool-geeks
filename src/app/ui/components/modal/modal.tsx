import React, { useEffect, useState } from "react";

import "./modal.scss";
import DetectOutsideClick from "../detect-outside-click/detect-outside-click";

const Modal = (props: any) => {
	useEffect(() => {
		document.getElementsByTagName("body")[0].style.overflow = props.isShown ? "hidden" : "auto";
	}, [props.isShown]);

	return (
		<div className={`modal-container ${props.isShown ? "show" : ""}`}>
			<DetectOutsideClick action={() => props.close && props.close()}>
				{props.children}
			</DetectOutsideClick>
		</div>
	);
};

export default Modal;
