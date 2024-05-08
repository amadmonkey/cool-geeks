import Image from "next/image";
import React from "react";

const ListEmpty = () => {
	return (
		<div className="empty-container">
			<Image
				src={`/leaf.png`}
				height={0}
				width={0}
				style={{ height: "100px", width: "auto" }}
				sizes="100vw"
				alt="Picture of the author"
			/>
			<h1>NO ENTRIES</h1>
		</div>
	);
};

export default ListEmpty;
