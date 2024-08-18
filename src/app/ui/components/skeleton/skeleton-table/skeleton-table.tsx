import React from "react";

import "./skeleton-table.scss";
import { SKELETON_TYPES } from "@/utility";

const SkeletonTable = (props: any) => {
	const getTemplate = (type: string) => {
		switch (type) {
			case SKELETON_TYPES.RECEIPTS:
				return Array.from(Array(5).keys()).map((_: any, x: number) => {
					return (
						<tr key={x} className="receipts">
							<td>
								<span
									className="skeleton"
									style={{
										fontSize: 15,
									}}
								>
									&nbsp;
								</span>
								<br />
								<span
									className="skeleton"
									style={{
										fontSize: 13,
									}}
								>
									&nbsp;
								</span>
								<br />
								<span
									className="skeleton"
									style={{
										fontSize: 13,
									}}
								>
									&nbsp;
								</span>
							</td>
							<td>
								<span
									className="skeleton"
									style={{
										marginBottom: 2,
									}}
								>
									&nbsp;
								</span>
								<br />
								<span className="skeleton" style={{ fontSize: "20px" }}>
									&nbsp;
								</span>
							</td>
							<td>
								<span
									className="skeleton"
									style={{
										marginBottom: 2,
									}}
								>
									&nbsp;
								</span>
								<br />
								<span className="skeleton" style={{ fontSize: "20px" }}>
									&nbsp;
								</span>
							</td>
							<td>
								<span className="skeleton">&nbsp;</span>
							</td>
							<td>
								<span className="skeleton">&nbsp;</span>
							</td>
							<td>
								<span className="skeleton">&nbsp;</span>
							</td>
							<td
								style={{
									display: "flex",
									justifyContent: "center",
									alignContent: "center",
								}}
							>
								<span className="skeleton">&nbsp;</span>
							</td>
							<td>
								<span className="skeleton">&nbsp;</span>
							</td>
						</tr>
					);
				});
			case SKELETON_TYPES.ACCOUNTS:
				return Array.from(Array(5).keys()).map((_: any, x: number) => {
					return (
						<tr key={x} className="accounts">
							<td>
								<span
									className="skeleton"
									style={{
										fontSize: 15,
									}}
								>
									&nbsp;
								</span>
								<br />
								<span
									className="skeleton"
									style={{
										fontSize: 13,
									}}
								>
									&nbsp;
								</span>
								<br />
								<span
									className="skeleton"
									style={{
										fontSize: 13,
									}}
								>
									&nbsp;
								</span>
							</td>
							<td>
								<span className="skeleton">&nbsp;</span>
							</td>
							<td>
								<span className="skeleton">&nbsp;</span>
							</td>
							<td>
								<span
									className="skeleton"
									style={{
										fontSize: 13,
									}}
								>
									&nbsp;
								</span>
								<br />
								<span
									className="skeleton"
									style={{
										fontSize: 13,
									}}
								>
									&nbsp;
								</span>
							</td>
							<td>
								<span
									className="skeleton"
									style={{
										fontSize: 15,
									}}
								>
									&nbsp;
								</span>
								<br />
								<span
									className="skeleton"
									style={{
										fontSize: 13,
									}}
								>
									&nbsp;
								</span>
								<br />
								<span
									className="skeleton"
									style={{
										fontSize: 13,
									}}
								>
									&nbsp;
								</span>
							</td>
							<td>
								<span className="skeleton">&nbsp;</span>
							</td>
							<td>
								<span className="skeleton">&nbsp;</span>
							</td>
						</tr>
					);
				});
			case SKELETON_TYPES.SUBD_LIST:
				return Array.from(Array(15).keys()).map((_: any, x: number) => {
					return (
						<tr key={x} className="plan-item__row">
							<td style={{ padding: "5px" }}>
								<span className="skeleton">&nbsp;</span>
							</td>
						</tr>
					);
				});
		}
	};

	return getTemplate(props.type);
};

export default SkeletonTable;
