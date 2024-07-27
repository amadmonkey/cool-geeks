import React from "react";

const SkeletonReceiptCard = () => {
	return Array.from(Array(3).keys()).map((_: any, i: number) => {
		return (
			<div key={i} className="receipt-card">
				<div className="image-container skeleton" style={{ backgroundColor: "#fff", height: 400 }}>
					&nbsp;
				</div>
			</div>
		);
	});
};

export default SkeletonReceiptCard;
