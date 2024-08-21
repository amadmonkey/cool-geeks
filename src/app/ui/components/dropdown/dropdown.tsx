"use client";

import React, { useEffect, useState } from "react";

import "./dropdown.scss";
import DetectOutsideClick from "../detect-outside-click/detect-outside-click";

const Dropdown = (props: any) => {
	const ENTER = "Enter";
	const DOWN = "ArrowDown";
	const UP = "ArrowUp";

	const [errors, setErrors] = useState<any>([]);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [nameFocused, setNameFocused] = useState(false);
	const [value, setValue] = useState(props?.value?.name || "");
	const [filteredList, setFilteredList] = useState(props.list);

	const isDisabled = () => (props.disabled || props.list?.length ? false : true);

	const onKeyUp = (e: any) => {
		switch (e.key) {
			case ENTER:
				onSelect(props.list[activeIndex]);
				break;
			case DOWN:
				focusNextListItem(DOWN);
				break;
			case UP:
				focusNextListItem(UP);
				break;
			default:
				break;
		}
	};

	const onSelect = (listItem: any) => {
		setActiveIndex(-1);
		setNameFocused(false);
		setValue(listItem.name);
		props.onChange && props.onChange(listItem);
		setFilteredList(props.list);
		validate(listItem.name);
	};

	const onChange = (e: any) => {
		setValue(e.target.value);
		setFilteredList(
			props.list.filter((listItem: any) => {
				return listItem.name.toLowerCase().includes(e.target.value.toLowerCase());
			})
		);
	};

	const onBlur = (e: any) => {
		setNameFocused(false);
		setFilteredList(props.list);
		setActiveIndex(-1);
		validate(e.target.value);
	};

	const validate = (input: any) => {
		const newErrors = [];
		if (props.required) {
			if (!input) {
				newErrors.push("This field is required");
			}
		}
		setErrors(newErrors);
	};

	const focusNextListItem = (direction: any) => {
		if (direction === DOWN) {
			const newIndex = activeIndex + 1 === props.list.length ? 0 : activeIndex + 1;
			setActiveIndex(newIndex);
		} else if (direction === UP) {
			const newIndex = activeIndex - 1 === -1 ? props.list.length - 1 : activeIndex - 1;
			setActiveIndex(newIndex);
		}
	};

	useEffect(() => {
		setFilteredList(props.list);
		setValue(props.value.name);
	}, [props]);

	return (
		<DetectOutsideClick action={() => setNameFocused(false)} style={{ display: "flex" }}>
			<ul
				className={`dropdown ${isDisabled() ? "disabled" : ""} ${errors.length ? "error" : ""} ${
					props.className
				}`}
				style={{ ...props.style }}
			>
				<li>
					<input
						type="text"
						className="dropdown__search"
						value={value}
						onChange={onChange}
						onFocus={() => setNameFocused(true)}
						onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
						onKeyUp={onKeyUp}
						placeholder={props.placeholder}
						disabled={isDisabled()}
						required={props.required ? true : false}
					/>
				</li>
				<li className={`list-container${nameFocused ? " active" : ""}`}>
					<ul className={`dropdown__list ${nameFocused ? "active" : ""}`} tabIndex={-1}>
						{filteredList.length ? (
							filteredList?.map((listItem: any, index: number) => {
								return (
									<li
										role="button"
										id={listItem._id}
										key={`${listItem._id}-${index}`}
										className={`dropdown__list-item ${activeIndex === index ? "active" : ""}  ${
											value === listItem.name ? " selected" : " "
										} `}
										tabIndex={-1}
										onSelect={() => onSelect(listItem)}
										onClick={() => onSelect(listItem)}
									>
										<span className="option-wrapper">{listItem.name}</span>
									</li>
								);
							})
						) : (
							<span
								style={{
									display: "flex",
									justifyContent: "center",
									fontWeight: 800,
									fontSize: "14px",
									color: "#bbb",
								}}
							>
								No results found
							</span>
						)}
					</ul>
				</li>
			</ul>
			{errors.length > 0 && <p className="error-message">{errors[0]}</p>}
		</DetectOutsideClick>
	);
};

export default Dropdown;
