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
			{props.children(showConfirmModal)}
			<DetectOutsideClick action={closeConfirmModal} isShown={modalIsShown}>
				<Modal isShown={modalIsShown} close={closeConfirmModal}>
					<Card style={{ width: "500px" }}>{props.template && props.template()}</Card>
					<div
						style={{
							width: "100%",
							display: "inline-flex",
							justifyContent: "center",
							position: "relative",
							gap: 10,
						}}
					>
						<FormGroup style={{ width: "150px" }}>
							<Button
								type="button"
								className="hanging"
								onClick={closeConfirmModal}
								style={{ letterSpacing: "2px" }}
							>
								CANCEL
							</Button>
						</FormGroup>
						<FormGroup style={{ width: "150px" }}>
							<Button
								type="button"
								className="info hanging"
								onClick={confirm}
								style={{ letterSpacing: "2px" }}
							>
								CONTINUE
							</Button>
						</FormGroup>
					</div>
				</Modal>
			</DetectOutsideClick>
		</>
	);
};

export default ConfirmModal;
