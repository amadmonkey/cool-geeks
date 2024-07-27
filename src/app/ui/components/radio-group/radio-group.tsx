import React from "react";

import "./radio-group.scss";

const RadioGroup = (props: any) => {
	return (
		<div className="radio-toggle" style={props.style}>
			{props.list &&
				props.list.map((item: any, i: number) => {
					return (
						<div className="radio-toggle__item" key={`${item.name}-${i}`}>
							<input
								type="radio"
								className="radio-toggle__item__input"
								name={`item-${item.name}-${i}`}
								id={`item-${item.name}-${i}`}
								checked={props.selected === item.name}
								value={item.name}
								onChange={() => props.onChange(item.name)}
							/>
							<label htmlFor={`item-${item.name}-${i}`} className="radio-toggle__item__label">
								{item.label}
							</label>
						</div>
					);
				})}
		</div>
	);
};

export default RadioGroup;
