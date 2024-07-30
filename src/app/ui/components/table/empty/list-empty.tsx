import Image from "next/image";
import React from "react";

import "./list-empty.scss";

const ListEmpty = (props: any) => {
	return (
		<div className="empty-container" style={props.style}>
			<Image
				src={`/leaf.png`}
				height={0}
				width={0}
				style={{ height: "100px", width: "auto" }}
				sizes="100vw"
				alt="Picture of the author"
			/>
			<span>{props.label || ""}</span>
		</div>
	);
};

export default ListEmpty;
