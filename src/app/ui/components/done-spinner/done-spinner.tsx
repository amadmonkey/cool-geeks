import React, { useState } from "react";
import IconDoneSpinner from "../../../../../public/done-spinner.svg";

const DoneSpinner = (props: any) => {
	const [status, setStatus] = useState("progress");
	return <IconDoneSpinner className={status} />;
};

export default DoneSpinner;
