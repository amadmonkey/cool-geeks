"use client";

import Image from "next/image";
import Button from "@/app/ui/components/button/button";
import Card from "@/app/ui/components/card/card";
import Link from "next/link";
import React, { useState } from "react";

import "./page.scss";
import Pending from "../../../../public/wait.svg";

const Admin = () => {
	const [list, setList] = useState(receiptHistory);

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "DONE":
				return (
					<Image
						src="/done.svg"
						alt="DONE"
						height={0}
						width={0}
						style={{ height: "20px", width: "auto" }}
					/>
				);
			case "PENDING":
				return (
					<Image
						src="/wait.svg"
						alt="DONE"
						height={0}
						width={0}
						style={{ height: "20px", width: "auto" }}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="content">
			<section
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "end",
					width: "100%",
				}}
			>
				<div
					className="filters"
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "10px",
						width: "100%",
					}}
				>
					<input className="search" placeholder="Search" />
				</div>
				<Card>
					<div className="cg-table">
						<table>
							<thead>
								<tr>
									<th>ACCOUNT NUMBER</th>
									<th>NAME</th>
									<th>DATE</th>
									<th>RATE</th>
									<th>REF NUMBER</th>
									<th>STATUS</th>
									<th>
										<Link href="">Show All Images</Link>
									</th>
									<th>&nbsp;</th>
									<th>&nbsp;</th>
								</tr>
							</thead>
							<tbody>
								{list.map((item: any, index: number) => {
									return (
										<tr key={index}>
											<td>{item.accountNumber}</td>
											<td>{`${item.firstname} ${item.lastname}`}</td>
											<td>{item.date}</td>
											<td>{item.rate}</td>
											<td>{item.referenceNumber}</td>
											<td
												style={{
													display: "flex",
													justifyContent: "center",
													alignContent: "center",
												}}
											>
												{getStatusIcon(item.status)}
											</td>
											<th>&nbsp;</th>
											<td>
												<Button mini danger>
													Deny
												</Button>
											</td>
											<td>
												<Button mini>Accept</Button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</Card>
			</section>
		</div>
	);
};

const receiptHistory = [
	{
		accountNumber: "123456789",
		referenceNumber: "987654321",
		firstname: "Manny",
		lastname: "Villar",
		date: "March 2024",
		rate: 1000,
		status: "PENDING",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		accountNumber: "123456789",
		referenceNumber: "987654321",
		firstname: "Manny",
		lastname: "Villar",
		date: "March 2024",
		rate: 1000,
		status: "PENDING",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		accountNumber: "123456789",

		referenceNumber: "987654321",
		firstname: "Manny",
		lastname: "Villar",
		date: "March 2024",
		rate: 1000,
		status: "PENDING",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		accountNumber: "123456789",
		referenceNumber: "987654321",
		firstname: "Manny",
		lastname: "Villar",
		date: "March 2024",
		rate: 1000,
		status: "DONE",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		accountNumber: "123456789",
		referenceNumber: "987654321",
		firstname: "Manny",
		lastname: "Villar",
		date: "March 2024",
		rate: 1000,
		status: "DONE",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		accountNumber: "123456789",
		referenceNumber: "987654321",
		firstname: "Manny",
		lastname: "Villar",
		date: "March 2024",
		rate: 1000,
		status: "DONE",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

export default Admin;
