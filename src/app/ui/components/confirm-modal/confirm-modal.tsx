import React, { useEffect, useRef, useState } from "react";
import Modal from "../modal/modal";
import Card from "../card/card";
import DetectOutsideClick from "../detect-outside-click/detect-outside-click";
import FormGroup from "../form-group/form-group";
import Button from "../button/button";

import "./confirm-modal.scss";

const ConfirmModal = (props: any) => {
	const passedProps = useRef<unknown>(null);
	const [modalIsShown, setModalIsShown] = useState(false);

	const showConfirmModal = (props: unknown) => {
		passedProps.current = props;
		setModalIsShown(true);
	};

	const closeConfirmModal = async () => setModalIsShown(false);

	const confirm = () => {
		closeConfirmModal().then(() => {
			props.continue(passedProps.current);
		});
	};

	return (
		<div className="confirm-modal">
			{props.children(showConfirmModal)}
			<DetectOutsideClick action={closeConfirmModal} isShown={modalIsShown}>
				<Modal isShown={modalIsShown} close={closeConfirmModal}>
					<Card style={{ width: "500px" }}>
						{props.template && props.template(passedProps.current)}
					</Card>
					<footer className="confirm-modal__footer">
						<FormGroup>
							<Button type="button" className="hanging" onClick={closeConfirmModal}>
								CANCEL
							</Button>
						</FormGroup>
						<FormGroup>
							<Button type="button" className="info hanging" onClick={confirm}>
								CONTINUE
							</Button>
						</FormGroup>
					</footer>
				</Modal>
			</DetectOutsideClick>
		</div>
	);
};

export default ConfirmModal;
