import React, { useRef, useState } from "react";
import Image from "next/image";

import "./file-input.scss";
import Magnifier from "../magnifier/magnifier";

interface Props {
	name: string;
	value: FormDataEntryValue | null;
	onChange: (e: any) => void;
}

const fileTypes = ["image/jpeg", "image/png", "application/pdf"];

const FileInput = (props: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const [file, setFile] = useState(null);
	const handleFileChange = (e: any) => {
		const file = e.currentTarget.files[0];
		if (fileTypes.includes(file.type)) {
			imageRef.current!.src = URL.createObjectURL(file);
			setFile(file);
			props.onChange({ target: { name: props.name, value: inputRef, type: "file" } });
		}
	};
	const removeFile = (e: any) => {
		e.stopPropagation();
		imageRef.current!.src = "/file-upload.svg";
		setFile(null);
		inputRef.current!.value = "";
	};

	return (
		<div
			className="file-upload"
			role="button"
			tabIndex={0}
			onClick={() => inputRef.current!.click()}
		>
			<input
				name={props.name}
				ref={inputRef}
				type="file"
				accept=".png,.jpg,.jpeg,.pdf"
				onChange={handleFileChange}
			/>
			<div className="label">
				<Magnifier imageRef={imageRef}>
					<Image
						className={file ? "has-image" : ""}
						ref={imageRef}
						src={`/file-upload.svg`}
						height={0}
						width={0}
						sizes="100vw"
						alt="Picture of the author"
					/>
				</Magnifier>
				<p className={`${file ? "hide" : ""}`}>DROP IMAGE HERE OR CLICK TO BROWSE</p>
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
