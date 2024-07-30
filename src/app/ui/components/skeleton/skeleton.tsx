import { SKELETON_TYPES } from "@/utility";
import React from "react";
import SkeletonTable from "./skeleton-table/skeleton-table";
import SkeletonSubd from "./skeleton-subd/skeleton-subd";
import SkeletonReceiptCard from "./skeleton-receipt-card/skeleton-receipt-card";

const Skeleton = (props: any) => {
	const getTemplate = (type: string) => {
		switch (type) {
			case SKELETON_TYPES.SUBD:
				return <SkeletonSubd />;
			case SKELETON_TYPES.RECEIPTS:
				return <SkeletonTable type={SKELETON_TYPES.RECEIPTS} />;
			case SKELETON_TYPES.RECEIPT_CARD:
				return <SkeletonReceiptCard />;
			case SKELETON_TYPES.ACCOUNTS:
				return <SkeletonTable type={SKELETON_TYPES.ACCOUNTS} />;
			case SKELETON_TYPES.PLAN:
				return <SkeletonTable type={SKELETON_TYPES.PLAN} />;
			default:
				return <SkeletonTable type={SKELETON_TYPES.RECEIPTS} />;
		}
	};
	return <>{getTemplate(props.type)}</>;
};

export default Skeleton;
