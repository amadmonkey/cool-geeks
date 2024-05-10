import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import "./file-input.scss";
import Magnifier from "../magnifier/magnifier";
import { VALID_IMG_TYPES } from "@/utility";

const FileInput = (props: any) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const defaultSrc = "/file-upload.svg";

	const handleFileChange = (file: File) => {
		if (VALID_IMG_TYPES.includes(file.type)) {
			imageRef.current!.src = URL.createObjectURL(file);
			setFile(file);
			props.onChange({
				target: {
					name: props.name,
					value: inputRef.current?.files?.length ? inputRef.current?.files[0] : file,
					type: "file",
				},
			});
		}
	};

	const removeFile = (e: any) => {
		e.stopPropagation();
		imageRef.current!.src = defaultSrc;
		setFile(null);
		inputRef.current!.value = "";
	};

	useEffect(() => {
		if (props.value) {
			handleFileChange(props.value);
		}
	}, [props.value]);

	return (
		<div
			className={`file-upload ${props.mini ? "mini" : ""}`}
			role="button"
			tabIndex={0}
			onClick={() => inputRef.current!.click()}
		>
			<input
				name={props.name}
				ref={inputRef}
				type="file"
				accept=".png,.jpg,.jpeg,.pdf"
				onChange={(e: any) => handleFileChange(e.currentTarget.files[0])}
			/>
			<div className="label" style={{ gap: "5px" }}>
				<Magnifier imageRef={imageRef} disabled={props.mini ? true : false}>
					<Image
						className={file ? "has-image" : ""}
						ref={imageRef}
						src={file ? URL.createObjectURL(file) : "/file-upload.svg"}
						height={0}
						width={0}
						sizes="100vw"
						alt=""
					/>
				</Magnifier>
				{!props.mini && (
					<p className={`${file ? "hide" : ""}`}>
						{props.label || "DROP IMAGE HERE OR CLICK TO BROWSE"}
					</p>
				)}
				{file && (
					<button className="cg-button __circle" onClick={removeFile}>
						<span className="sr-only">Remove File</span>
					</button>
				)}
			</div>
		</div>
	);
};

export default FileInput;
