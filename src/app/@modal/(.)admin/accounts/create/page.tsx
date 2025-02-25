"use client";
import React from "react";
import { useRouter } from "next/navigation";

import Modal from "@/app/ui/components/modal/modal";
import DetectOutsideClick from "@/app/ui/components/detect-outside-click/detect-outside-click";
import AddAccount from "@/app/(home)/admin/accounts/create/page";

export default function AccountModal(props: any) {
	const router = useRouter();
	const close = () => router.back();
	return (
		<DetectOutsideClick action={close} isShown={true}>
			<Modal isShown={true} close={close}>
				<AddAccount />
			</Modal>
		</DetectOutsideClick>
	);
}
