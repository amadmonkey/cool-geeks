import React from "react";
import Dropdown from "../dropdown/dropdown";

import "./select-input.scss";

type SelectInput = {
	list: Array<Object>;
};

const SelectInput = (props: SelectInput) => {
	return (
		<div className="select-input">
			<Dropdown
				name=""
				style={{ width: "140px" }}
				list={props.list}
				value={""}
				// onChange={(v: any) => setDateType(v)}
				placeholder="Date"
				required
			/>
			<input type="text" />
		</div>
	);
};

export default SelectInput;
