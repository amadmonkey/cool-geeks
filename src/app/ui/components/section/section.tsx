import React from "react";

const Section = (props: any) => {
	return (
		<section style={{ display: "flex", flexDirection: "column", width: "100%" }}>
			<header className="page-header">
				<h1
					className="section-title"
					style={{
						gap: "5px",
						display: "flex",
						marginBottom: "unset",
						alignItems: "center",
					}}
				>
					{props.title}
				</h1>
				{props.others}
			</header>
			{props.children}
		</section>
	);
};

export default Section;
