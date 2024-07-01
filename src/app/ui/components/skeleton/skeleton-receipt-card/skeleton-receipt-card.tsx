import React from "react";
import Card from "../../card/card";

const SkeletonReceiptCard = () => {
	return Array.from(Array(3).keys()).map((_: any, i: number) => {
		return (
			<div key={i} className="receipt-card">
				<div className="image-container skeleton" style={{ backgroundColor: "#fff", height: 400 }}>
					&nbsp;
				</div>
				<Card>
					<div className="receipt-card__form-group">
						<label htmlFor="">USER</label>
						<span className="skeleton" style={{ width: 200 }}>
							&nbsp;
						</span>
					</div>
					<div className="receipt-card__form-group">
						<label htmlFor="">SUBD</label>
						<span className="skeleton" style={{ width: 200 }}>
							&nbsp;
						</span>
					</div>
					<div className="receipt-card__form-group">
						<label htmlFor="">CUTOFF</label>
						<span className="skeleton" style={{ width: 200 }}>
							&nbsp;
						</span>
					</div>
					<div className="receipt-card__form-group">
						<label htmlFor="">RECEIPT DATE</label>

						<span className="skeleton" style={{ width: 200 }}>
							&nbsp;
						</span>
					</div>
					<div className="receipt-card__form-group">
						<label htmlFor="">PLAN</label>
						<span className="skeleton" style={{ width: 200 }}>
							&nbsp;
						</span>
					</div>
					<div className="receipt-card__form-group">
						<label htmlFor="">REF NUMBER</label>
						<span className="skeleton" style={{ width: 200 }}>
							&nbsp;
						</span>
					</div>
					<footer>&nbsp;</footer>
				</Card>
			</div>
		);
	});
};

export default SkeletonReceiptCard;
