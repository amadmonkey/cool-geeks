import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { CONSTANTS, VALID_IMG_TYPES } from "@/utility";
import Image from "next/image";

// svgs
import IconReplace from "@/public/replace.svg";

// types
import Subd from "@/app/ui/types/Subd";

type SubdQrProps = {
	subd: Subd;
	file: File | null;
	handleFileUpdate: Function;
};

const SubdQr = (props: SubdQrProps) => {
	const subd = useRef(props.subd);
	const signal = useRef<any>();
	const controller = useRef<any>();
	const imageRef = useRef<HTMLImageElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [qrUrl, setQrUrl] = useState(CONSTANTS.loaderFixed);

	const handleFileChange = async (subd: any, file: File) => {
		if (VALID_IMG_TYPES.includes(file.type)) {
			imageRef.current?.classList.remove("error");
			imageRef.current!.src = URL.createObjectURL(file);

			const formData = new FormData();
			formData.append("qr", file);
			subd._id && formData.append("_id", subd._id);
			subd.imageId && formData.append("imageId", subd.imageId);

			const { code, data } = await fetch("/api/subd", {
				method: "PATCH",
				headers: {},
				body: formData,
				credentials: "include",
			}).then((res) => res.json());

			switch (code) {
				case 200:
					props.handleFileUpdate(file);
					setQrUrl(fileToUrl(file));
					toast.success("Subdivision updated successfully.");
					break;
				case 400:
					break;
				default:
					break;
			}
		}
	};

	const getImage = async () => {
		try {
			if (controller.current) controller.current.abort();
			controller.current = new AbortController();
			signal.current = controller.current.signal;

			const searchOptions = new URLSearchParams({
				id: subd.current.imageId,
				sort: JSON.stringify({ createdAt: "desc" }),
				action: "/image",
			});

			const res = await fetch(`/api/subd?${searchOptions}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				signal: signal.current,
			}).then((res) => res.json());
			console.log(res);
			props.handleFileUpdate(res);
			setQrUrl(res.data);
		} catch (e: any) {
			if (e.name === "AbortError") return;
			console.log(e);
		}
	};

	const fileToUrl = (file: any) => {
		const urlCreator = window.URL || window.webkitURL;
		return urlCreator.createObjectURL(file);
	};

	useEffect(() => {
		getImage();
	}, []);

	useEffect(() => {
		subd.current = props.subd;
	}, [props.subd]);

	return (
		<div className="qr-container">
			{qrUrl === CONSTANTS.loaderFixed ? (
				<div
					className="qr-container skeleton loading"
					style={{ height: "500px", width: "100%", maxWidth: "unset", borderRadius: "10px" }}
				></div>
			) : (
				<>
					<div
						className="image-container"
						style={qrUrl === CONSTANTS.empty ? { height: "400px" } : {}}
						onClick={() => fileInputRef.current!.click()}
					>
						<Image
							alt="qr"
							width={0}
							height={0}
							quality={100}
							src={qrUrl}
							ref={imageRef}
							onErrorCapture={(e: any) => {
								setQrUrl(CONSTANTS.empty);
								e.currentTarget.className = "error";
							}}
							onChange={(e: any) => {
								e.currentTarget.classList.remove("error");
							}}
							style={qrUrl === CONSTANTS.loaderFixed ? { height: "100px", width: "100px" } : {}}
							unoptimized
						/>
					</div>
					<input
						ref={fileInputRef}
						type="file"
						accept=".png,.jpg,.jpeg,.pdf"
						onChange={(e: any) => {
							setQrUrl(CONSTANTS.loaderFixed);
							handleFileChange(subd.current, e.currentTarget.files[0]);
						}}
					/>
					<button onClick={() => fileInputRef.current!.click()}>
						<IconReplace /> CHANGE
					</button>
				</>
			)}
		</div>
	);
};

export default SubdQr;
