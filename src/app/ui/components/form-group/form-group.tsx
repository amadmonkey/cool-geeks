import React, { useState } from "react";
import Modal from "@/app/ui/components/modal/modal";
import Card from "@/app/ui/components/card/card";
import IconHelp from "../../../../../public/help.svg";

import "./form-group.scss";
import Button from "../button/button";

const FormGroup = (props: any) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="form-group">
			{props.label && (
				<label htmlFor="text-input">
					<span>{`${props.label} ${props.required ? "*" : ""}`}</span>
					{props.help && (
						<button type="button" onClick={() => setIsOpen(true)}>
							<span className="sr-only">Help</span>
							{props.help && props.help.icon}
						</button>
					)}
				</label>
			)}
			{props.children}
			<Modal isOpen={isOpen}>
				<Card
					style={{
						width: "400px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					{props.help && props.help.body}
					<Button
						onClick={() => setIsOpen(false)}
						style={{
							marginTop: "20px",
						}}
					>
						CLOSE
					</Button>
				</Card>
			</Modal>
		</div>
	);
};

export default FormGroup;
