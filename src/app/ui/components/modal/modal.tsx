import React, { useState } from "react";

import "./modal.scss";

const Modal = (props: any) => {
	return <div className={`modal ${props.isOpen ? "show" : ""}`}>{props.children}</div>;
};

export default Modal;
