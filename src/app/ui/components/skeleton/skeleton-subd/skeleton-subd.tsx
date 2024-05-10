import React from "react";
import Card from "../../card/card";
import Table from "../../table/table";
import { SKELETON_TYPES, TABLE_HEADERS } from "@/utility";
import Skeleton from "../skeleton";

const SkeletonSubd = (props: any) => {
	return Array.from(Array(4).keys()).map((_: any, i: number) => {
		return (
			<Card key={i} type="subd">
				<div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
					<div style={{ width: "100%" }}>
						<h1 className="skeleton" style={{ height: 30, marginBottom: 6 }}>
							&nbsp;
							<span>&nbsp;</span>
						</h1>
						<span className="skeleton" style={{ height: 19, marginBottom: 3 }}>
							&nbsp;
						</span>
						<span className="skeleton" style={{ height: 19, marginBottom: 3 }}>
							&nbsp;
						</span>
						<span className="skeleton" style={{ height: 19, marginBottom: 3 }}>
							&nbsp;
						</span>
					</div>
					<div className="skeleton" style={{ height: 100, width: 200 }}>
						<div className="qr-container">
							<span style={{ width: "auto", borderRadius: 10 }}></span>
						</div>
					</div>
				</div>
				<Table type="plans" headers={TABLE_HEADERS.plans}>
					<Skeleton type={SKELETON_TYPES.PLAN} />
				</Table>
			</Card>
		);
	});
};

export default SkeletonSubd;
