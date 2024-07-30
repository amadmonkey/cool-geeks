import React, { useEffect } from "react";

import "./modal.scss";
import DetectOutsideClick from "../detect-outside-click/detect-outside-click";

const Modal = (props: any) => {
	useEffect(() => {
		document.getElementsByTagName("body")[0].style.overflow = props.isShown ? "hidden" : "auto";
	}, [props.isShown]);

	return (
		<div className={`modal-container ${props.isShown ? "show" : ""} ${props.clear ? "clear" : ""}`}>
			<div className="modal-container__content">
				<DetectOutsideClick action={props.close}>{props.children}</DetectOutsideClick>
			</div>
		</div>
	);
};

export default Modal;
