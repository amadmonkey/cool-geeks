import React, { useEffect, useState } from "react";
import TextInput from "../text-input/text-input";

import DetectOutsideClick from "../detect-outside-click/detect-outside-click";
import IconCheck from "@/public/check.svg";
import IconEdit from "@/public/edit2.svg";

import "./inline-edit-input.scss";

const InlineEditInput = (props: any) => {
	const [isActive, setIsActive] = useState(false);

	const handleActiveToggle = (e: any) => {
		e.stopPropagation();
		if (!isActive) setIsActive(true);
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		setIsActive(false);
		props.onSubmit(e);
	};

	const onOutsideClick = () => {
		setIsActive(false);
		props.onCancel && isActive && props.onCancel();
	};

	useEffect(() => {
		props.action && isActive === false && props.action();
	}, [isActive]);

	return (
		<DetectOutsideClick action={onOutsideClick}>
			<div
				tabIndex={0}
				className={`inline-edit-input-container${isActive ? " active" : ""} ${props.className}`}
				onClick={handleActiveToggle}
			>
				<span className="highlight">
					{props.children}
					<IconEdit className="edit-icon" />
				</span>
				<form onSubmit={handleSubmit}>
					<TextInput
						type={props.type}
						name={props.name}
						value={props.value}
						minLength={props.minLength}
						maxLength={props.maxLength}
						onChange={props.onChange}
						placeholder={props.placeholder}
						style={props.inputStyle}
						autoFocus={true}
						line
					/>
					<button type="submit" style={props.buttonStyle}>
						<IconCheck />
					</button>
				</form>
			</div>
		</DetectOutsideClick>
	);
};

export default InlineEditInput;
