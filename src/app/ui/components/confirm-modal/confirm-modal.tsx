import React, { useEffect, useState } from "react";
import Modal from "../modal/modal";
import Card from "../card/card";
import DetectOutsideClick from "../detect-outside-click/detect-outside-click";
import FormGroup from "../form-group/form-group";
import Button from "../button/button";

const ConfirmModal = (props: any) => {
	const [modalIsShown, setModalIsShown] = useState(false);

	const showConfirmModal = (e: any) => {
		e.preventDefault();
		setModalIsShown(true);
	};

	const closeConfirmModal = async () => setModalIsShown(false);

	const confirm = () => {
		closeConfirmModal().then(() => {
			props.continue();
		});
	};

	return (
		<>
			<div>{props.children(showConfirmModal)}</div>
			<DetectOutsideClick action={closeConfirmModal}>
				<Modal isShown={modalIsShown} close={closeConfirmModal}>
					<Card>
						{props.template()}
						<div style={{ width: "100%", position: "relative", display: "flex", gap: 10 }}>
							<FormGroup style={{ width: "100%" }}>
								<Button type="button" onClick={closeConfirmModal}>
									CANCEL
								</Button>
							</FormGroup>
							<FormGroup style={{ width: "100%" }}>
								<Button type="button" className="info" onClick={confirm}>
									SUBMIT
								</Button>
							</FormGroup>
						</div>
					</Card>
				</Modal>
			</DetectOutsideClick>
		</>
	);
};

export default ConfirmModal;
