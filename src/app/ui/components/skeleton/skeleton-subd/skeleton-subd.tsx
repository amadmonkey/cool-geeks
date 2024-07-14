import React from "react";
import { SKELETON_TYPES, TABLE_HEADERS, UI_TYPE } from "@/utility";
import Skeleton from "../skeleton";
import HoverBubble from "../../hover-bubble/hover-bubble";
import IconHelp from "../../../../../../public/help.svg";

import "./skeleton-subd.scss";

const SkeletonSubd = (props: any) => {
	return (
		<div className="content__subd loading">
			<div className="subd-container">
				<header>
					<h1 className="skeleton"></h1>
					<p className="skeleton"></p>
					<div className="dates">
						<div>
							<label htmlFor="date-created">CREATED</label>
							<span id="date-created" className="skeleton"></span>
						</div>
						<div>
							<label htmlFor="date-created">UPDATED</label>
							<span id="date-created" className="skeleton"></span>
						</div>
					</div>
				</header>
				<div className="plans-container">
					<header>
						<h1>PLANS</h1>
					</header>
					<table className="plan-table">
						<thead>
							<tr>
								<th>NAME</th>
								<th>RATE</th>
								<th>UPDATED</th>
								<th>
									<HoverBubble
										style={{ display: "flex", gap: "3px" }}
										message="Plan status states whether the plan will be selectable during account creation."
										type={UI_TYPE.info}
									>
										<IconHelp />
										STATUS
									</HoverBubble>
								</th>
							</tr>
						</thead>
						<tbody className="plan-item">
							<Skeleton type={SKELETON_TYPES.PLAN} />
						</tbody>
						<tbody className="plan-item">
							<Skeleton type={SKELETON_TYPES.PLAN} />
						</tbody>
						<tbody className="plan-item">
							<Skeleton type={SKELETON_TYPES.PLAN} />
						</tbody>
						<tbody className="plan-item">
							<Skeleton type={SKELETON_TYPES.PLAN} />
						</tbody>
						<tbody className="plan-item">
							<Skeleton type={SKELETON_TYPES.PLAN} />
						</tbody>
					</table>
				</div>
				{/* <pre>{JSON.stringify(plans, undefined, 2)}</pre> */}
			</div>
			<div
				className="qr-container skeleton"
				style={{ height: "500px", width: "100%", maxWidth: "unset", borderRadius: "10px" }}
			>
				{/* <div style={{ height: "500px", width: "100%" }} className="skeleton"></div> */}
				{/* <Image
						alt="qr"
						ref={imageRef}
						height={0}
						width={0}
						unoptimized
						src={`${process.env.NEXT_PUBLIC_API}/qr/${subd.gcash.qr.filename}`}
						onClick={() => inputRef.current!.click()}
					/> */}
			</div>
		</div>
	);
};

export default SkeletonSubd;
