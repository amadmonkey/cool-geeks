import React, { useEffect, useState } from "react";
import Modal from "../modal/modal";
import Card from "../card/card";
import DetectOutsideClick from "../detect-outside-click/detect-outside-click";
import FormGroup from "../form-group/form-group";
import Button from "../button/button";

const ConfirmModal = (props: any) => {
	const [modalIsShown, setModalIsShown] = useState(false);

	const showConfirmModal = (e: any) => {
		e && e.preventDefault();
		setModalIsShown(true);
	};

	const closeConfirmModal = async () => setModalIsShown(false);

	const confirm = (e: any) => {
		closeConfirmModal().then(() => {
			props.continue(e);
		});
	};

	return (
		<>
			<div>{props.children(showConfirmModal)}</div>
			<DetectOutsideClick action={closeConfirmModal} isShown={modalIsShown}>
				<Modal isShown={modalIsShown} close={closeConfirmModal}>
					<Card style={{ width: "500px" }}>
						{props.template && props.template()}
						<div style={{ width: "100%", position: "relative", display: "flex", gap: 10 }}>
							<FormGroup style={{ width: "100%" }}>
								<Button type="button" onClick={closeConfirmModal}>
									CANCEL
								</Button>
							</FormGroup>
							<FormGroup style={{ width: "100%" }}>
								<Button type="button" className="info" onClick={confirm}>
									CONTINUE
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
