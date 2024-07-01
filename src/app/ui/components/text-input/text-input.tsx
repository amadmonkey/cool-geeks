import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ENHANCE_FORMAT, IS_MODIFIER_KEY, REMOVE_SPACES } from "@/utility";

import "./text-input.scss";

type payMethod = {
	id: number;
	name: string;
	icon: string;
};

const TextInput = (props: any) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [errors, setErrors] = useState<any>([]);
	const [validating, setValidating] = useState(false);
	const [refNoActive, setRefNoActive] = useState(false);
	const [miniDropdownVal, setMiniDropdownVal] = useState<payMethod>({
		id: 1,
		name: "gcash",
		icon: "", // blob
	});

	useEffect(() => {
		// https://jsfiddle.net/rafj3md0/ then edited
		const formatToPhone = (event: any) => {
			if (IS_MODIFIER_KEY(event)) return;
			if (props.maxLength && event.target.value.length >= props.maxLength) return;

			const { target } = event;
			const input = REMOVE_SPACES(event.target.value).substring(0, props.minLength);

			const parts = {
				first: "",
				middle: "",
				last: "",
			};

			switch (props.type) {
				case "tel":
					Object.assign(parts, {
						first: input.substring(0, 3),
						middle: input.substring(3, 6),
						last: input.substring(6, 10),
					});
					break;
				case "mini-dropdown":
					if (miniDropdownVal.name === "gcash") {
						Object.assign(parts, {
							first: input.substring(0, 4),
							middle: input.substring(4, 7),
							last: input.substring(7, 13),
						});
					}
					if (miniDropdownVal.name === "bpi") {
						Object.assign(parts, {
							first: input,
						});
					}
					break;
				default:
					break;
			}

			const { first, middle, last } = parts;
			const hasSpace = miniDropdownVal.name !== "bpi";
			if (input.length > 6) {
				target.value = `${first}${hasSpace ? " " : ""}${middle}${hasSpace ? " " : ""}${last}`;
			} else if (input.length > 3) {
				target.value = `${first}${hasSpace ? " " : ""}${middle}`;
			} else if (input.length > 0) {
				target.value = `${first}`;
			}
		};
		if (props.type === "tel" || props.type === "mini-dropdown") {
			// inputRef.current?.addEventListener("keydown", (e) => ENHANCE_FORMAT(e, props.maxLength));
			inputRef.current?.addEventListener("keypress", (e) => {
				ENHANCE_FORMAT(e, props.maxLength);
				formatToPhone(e);
			});
		} else {
			inputRef.current?.addEventListener("keydown", (e) => {
				if (props.maxLength && inputRef.current!.value.length >= props.maxLength) return;
			});
		}
	}, [miniDropdownVal.name, props.minLength, props.maxLength, props.type]);

	const delayValidate = (e: any) => {
		if (e.key === "Enter") {
			validate(e, null);
		} else if (e.key === "Tab") {
			validate(e, null);
		} else {
			if (!validating) {
				setValidating(true);
				setTimeout(() => {
					validate(e, null);
					setValidating(false);
				}, 2000);
			}
		}
	};

	const validate = (e: any, item: any) => {
		const newErrors = [];
		if (!item) {
			const inputVal = e.target.value;
			if (props.required && inputVal.length === 0) {
				newErrors.push("This field is required");
			}
			if (props.minLength && inputVal.length < props.minLength) {
				newErrors.push(
					`This field requires at least ${
						props.minLength - (selectMiniDropdown.name === "gcash" ? 2 : 0)
					} characters`
				);
			}
			switch (props.type) {
				case "email":
					const emailRegex =
						/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					if (!inputVal.match(emailRegex)) {
						newErrors.push("Please enter a valid email");
					}
					break;
				case "password":
					if (props.otherPassword) {
						if (inputVal !== props.otherPassword) {
							newErrors.push("Passwords do not match");
						}
					}
					break;
				default:
					break;
			}
			setErrors(newErrors);
		}
		// const inputObj = {
		// 	...{ [props.name]: e.target.value ? e.target.value : "" },
		// 	...(item !== null && { refType: item }),
		// };
		// props.onChange && props.onChange(newErrors.length ? "" : inputObj);
	};

	const selectMiniDropdown = (e: any, item: any) => {
		if (item.id !== miniDropdownVal.id) {
			props.onChange({ target: { name: props.name, value: "" } });
			props.onChange({ target: { name: "referenceType", value: item } });
			setMiniDropdownVal(item);
			toggleMiniDropdown();
			validate(e, item);
		}
	};

	const toggleMiniDropdown = () => {
		setRefNoActive(!refNoActive);
	};

	return (
		<div
			className={`input-container ${props.type} ${props.mini ? "mini" : ""} ${
				props.line ? "line" : ""
			}`}
			style={props.style}
		>
			{props.type === "mini-dropdown" && (
				<div className={`mini-dropdown ${refNoActive ? "active" : ""}`}>
					<button
						className="cg-button"
						type="button"
						onClick={toggleMiniDropdown}
						tabIndex={0}
						disabled={props.disabled}
					>
						<Image
							src={`/${miniDropdownVal.name}.png`}
							height={0}
							width={0}
							sizes="100vw"
							style={{ width: "auto", height: "25px" }}
							alt="Picture of the author"
						/>
						<span className="down"></span>
					</button>
					<ul className="refDropdown" tabIndex={-1}>
						{props.miniDropdownList.map((item: any) => {
							return (
								<li
									key={item.id}
									role="button"
									tabIndex={refNoActive ? 0 : -1}
									onClick={(e) => selectMiniDropdown(e, item)}
								>
									<Image
										src={`/${item.name}.png`}
										height={0}
										width={0}
										sizes="100vw"
										alt="Picture of the author"
									/>
								</li>
							);
						})}
					</ul>
				</div>
			)}
			<input
				ref={inputRef}
				type={props.type ? props.type : "text"}
				name={props.name}
				value={props.value}
				minLength={props.minLength}
				maxLength={props.maxLength}
				className={`${errors.length ? "error" : ""} text-input`}
				placeholder={props.placeholder}
				style={props.style}
				onKeyUp={delayValidate}
				onChange={props.onChange}
				required={props.required}
				disabled={props.disabled}
			/>
			{errors.length > 0 && <p className="error-message">{errors[0]}</p>}
		</div>
	);
};

export default TextInput;
