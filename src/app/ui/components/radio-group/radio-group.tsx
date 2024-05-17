import React from "react";

import "./radio-group.scss";

const RadioGroup = (props: any) => {
	return (
		<div className="radio-toggle">
			{props.list &&
				props.list.map((item: any, i: number) => {
					return (
						<>
							<input
								key={`${item.name}-${i}`}
								type="radio"
								className="radio-toggle__input"
								name={`item-${item.name}-${i}`}
								id={`item-${item.name}-${i}`}
								checked={props.selected === item.name}
								value={item.name}
								onChange={() => props.onChange(item.name)}
							/>
							<label htmlFor={`item-${item.name}-${i}`} className="radio-toggle__label">
								{item.label}
							</label>
						</>
					);
				})}
		</div>
	);
};

export default RadioGroup;
