"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next";
import { ACCOUNT_STATUS, REGEX } from "@/utility";
import { toast, ToastItem } from "react-toastify";
import Image from "next/image";

import Button from "../../ui/components/button/button";
import TextInput from "../../ui/components/text-input/text-input";
import FormGroup from "../../ui/components/form-group/form-group";
import TSParticles from "@/app/ui/components/particles/particles";

// loading icons becoming convoluted fix
import IconBack from "../../../../public/back.svg";
import IconInfo from "../../../../public/info.svg";
import IconLoader from "../../../../public/loader.svg";
import IconLoading from "../../../../public/loading.svg";
import IconCheck from "../../../../public/done-colored.svg";

import "./page.scss";
import ConfirmModal from "@/app/ui/components/confirm-modal/confirm-modal";

const LoginForm = () => {
	const passToastId = useRef<any>(null);
	const { push, replace } = useRouter();
	const urlError = useSearchParams().get("e");
	const [error, setError] = useState<string | null>(null);
	const [accountStatus, setAccountStatus] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [verificationMessage, setVerificationMessage] = useState<any>(null);
	const [form, setForm] = useState({
		emailAccountNo: useSearchParams().get("u") || "",
		password: "",
		confirmPassword: "",
	});

	const updateForm = (e: any) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const validate = (e: any) => {
		// TODO: remove this
		if (form.password && !REGEX.PASSWORD.test(form.password)) {
			return false;
		}
		return true;
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		if (validate(e)) {
			if (form.confirmPassword) {
				console.log("verify");
				verify();
			} else if (form.password) {
				console.log("login");
				login();
			} else {
				console.log("getAccountStatus");
				getAccountStatus();
			}
			replace("/login", undefined);
		} else {
			setLoading(false);
		}
	};

	const login = async () => {
		try {
			const res = await fetch("/api/auth", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(form),
			});
			const { code, data } = await res.json();
			switch (code) {
				case 200:
					setError(null);
					setCookie("user", data.user);
					push(data.user.admin ? "/admin" : "/");
					break;
				default:
					setError(data.general);
					setLoading(false);
					break;
			}
		} catch (e) {
			console.log("login catch", e);
			setError("Server error. Please try again later or contact [number here].");
		}
	};

	const getAccountStatus = async () => {
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_MID}/api/auth?${new URLSearchParams({
					filter: JSON.stringify({ input: form.emailAccountNo }),
				})}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const { code, data } = await res.json();
			console.log(data);
			switch (code) {
				case 200:
					setLoading(false);
					switch (data.status) {
						case ACCOUNT_STATUS.VERIFY:
							verify();
							break;
						default:
							break;
					}
					setAccountStatus(data.status);
					if (!data.status) setError("User does not exist");
					break;
				default:
					setLoading(false);
					setError(data.general);
					break;
			}
		} catch (e) {
			console.log("login catch", e);
			setError("Server error. Please try again later or contact [number here].");
		}
	};

	const verify = async () => {
		try {
			const { code, data } = await fetch("/api/auth", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					endpoint: "verify-email",
					form: form,
				}),
			}).then((res) => res.json());
			switch (code) {
				case 200:
					setLoading(false);
					setVerificationMessage(data.general);
					setAccountStatus(ACCOUNT_STATUS.VERIFY);
					break;
				default:
					setLoading(false);
					setError(data.message);
					break;
			}
		} catch (e) {
			console.log("verify catch", e);
			setError("Server error. Please try again later or contact [number here].");
		}
	};

	const requestPasswordReset = async () => {
		try {
			passToastId.current = toast("Requesting for a password reset...", {
				autoClose: false,
				icon: <IconLoader style={{ height: "20px", stroke: "rgb(100, 100, 100)" }} />,
			});
			const { code, data } = await fetch("/api/auth", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					endpoint: "reset-password-request",
					form: form,
				}),
			}).then((res) => res.json());
			switch (code) {
				case 200:
					toast.dismiss(passToastId.current);
					toast.success("Password request sent. Please check your email for the next step.");
					break;
				default:
					setError(data.message);
					break;
			}
			setError(null);
		} catch (e) {
			console.log("requestPasswordReset catch", e);
			setError("Server error. Please try again later or contact [number here].");
		}
	};

	const getTemplate = (status: string | null) => {
		switch (status) {
			case ACCOUNT_STATUS.STANDARD:
				return (
					<>
						<FormGroup label="Password">
							<TextInput
								type="password"
								name="password"
								minLength="8"
								value={form.password}
								onChange={updateForm}
								autoFocus
								test={REGEX.PASSWORD}
								required
							/>

							<ConfirmModal template={forgotPasswordTemplate} continue={requestPasswordReset}>
								{(showConfirmModal: any) => {
									return (
										<button
											type="button"
											onClick={showConfirmModal}
											className="link"
											style={{ fontSize: "10px", display: "unset", textAlign: "right" }}
										>
											FORGOT PASSWORD
										</button>
									);
								}}
							</ConfirmModal>
						</FormGroup>
					</>
				);
			case ACCOUNT_STATUS.PENDING:
				return (
					<>
						<p className="instructions">Enter a password below to finalize your account.</p>
						<FormGroup label="Password">
							<TextInput
								type="password"
								name="password"
								minLength="8"
								value={form.password}
								onChange={updateForm}
								autoFocus
								test={REGEX.PASSWORD}
								required
							/>
							<ul
								className={`password-instructions${
									!REGEX.PASSWORD.test(form.password) ? " shown" : ""
								}`}
							>
								<li className={/[A-Z]/.test(form.password) ? "checked" : ""}>
									<IconCheck />
									<span>One(1) uppercase letter</span>
								</li>
								<li className={/[a-z]/.test(form.password) ? "checked" : ""}>
									<IconCheck />
									One(1) lowercase letter
								</li>
								<li className={/[0-9]/.test(form.password) ? "checked" : ""}>
									<IconCheck />
									One(1) digit
								</li>
								<li className={/[^A-Za-z0-9]/.test(form.password) ? "checked" : ""}>
									<IconCheck />
									One(1) special character
								</li>
								<li className={form.password.length > 7 ? "checked" : ""}>
									<IconCheck />
									Eight(8) cahracters in length
								</li>
							</ul>
						</FormGroup>
						<FormGroup label="Confirm Password">
							<TextInput
								type="password"
								name="confirmPassword"
								minLength="8"
								value={form.confirmPassword}
								otherPassword={form.password}
								onChange={updateForm}
								test={/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{9,}$/}
								required
							/>
						</FormGroup>
					</>
				);
			case ACCOUNT_STATUS.DEACTIVATED:
				return (
					<div className="deactivated-container">
						Account Deactivated. Please call or text [number here] or email us at [email here] for
						info
					</div>
				);
			case ACCOUNT_STATUS.VERIFY:
				return (
					<>
						<p className="instructions">{verificationMessage}</p>
						<p style={{ fontSize: "13px", textAlign: "center" }}>
							Didn`t get the email? Click{" "}
							<button className="link" style={{ letterSpacing: 0, padding: 0 }} onClick={verify}>
								here
							</button>{" "}
							to resend
						</p>
					</>
				);
			default:
				return;
		}
	};

	return (
		<section className="login-container">
			<Image
				src={`/geek-head.png`}
				height={0}
				width={0}
				sizes="100vw"
				alt="Logo head"
				className="login-container__head"
			/>
			<Image
				src={`/geek-text.png`}
				height={0}
				width={0}
				sizes="100vw"
				alt="Logo text"
				className="login-container__text"
			/>
			<h1>RECEIPT&nbsp;&nbsp;TRACKER</h1>
			<form onSubmit={handleSubmit}>
				<FormGroup label={accountStatus ? "Logging in as" : "Account Number or Email"}>
					{!accountStatus ? (
						<TextInput
							type="text"
							name="emailAccountNo"
							value={form.emailAccountNo}
							onChange={updateForm}
							autoFocus={true}
							required
						/>
					) : (
						<span style={{ fontSize: "16px", fontWeight: 800 }}>{form.emailAccountNo}</span>
					)}
				</FormGroup>
				{getTemplate(accountStatus)}
				{error && (
					<p className="error-message" style={{ textAlign: "center" }}>
						{error}
					</p>
				)}
				{loading && (
					<div style={{ display: "flex", justifyContent: "center" }}>
						<IconLoading style={{ height: "auto", width: "100px" }} />
					</div>
				)}
				{/* {loading.toString()} */}
				{/* {("accountStatus" !== ACCOUNT_STATUS.DEACTIVATED).toString()} */}
				{!loading &&
					accountStatus !== ACCOUNT_STATUS.DEACTIVATED &&
					accountStatus !== ACCOUNT_STATUS.VERIFY && (
						<FormGroup>
							<Button type="submit" className="info">
								{accountStatus === ACCOUNT_STATUS.STANDARD ? "LOGIN" : "CONTINUE"}
							</Button>
						</FormGroup>
					)}
				{accountStatus && (
					<button
						className="link"
						onClick={() => {
							setForm((prev) => ({
								...prev,
								...{
									password: "",
									confirmPassword: "",
								},
							}));
							setAccountStatus(null);
						}}
					>
						<IconBack />
						CHANGE USER
					</button>
				)}
				{urlError === "TOKEN_INVALID" && (
					<p className="error-message" style={{ textAlign: "center" }}>
						Activation link is either expired or invalid. Please enter account number or email to
						generate a new link.
					</p>
				)}
				{urlError === "USER" && (
					<p className="error-message" style={{ textAlign: "center" }}>
						Account is either already actived or does not exist.
					</p>
				)}
				{/* <pre>{JSON.stringify(form, undefined, 2)}</pre> */}
			</form>
		</section>
	);
};

const Particles = () => {
	return <TSParticles />;
};

const forgotPasswordTemplate = () => {
	return (
		<div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
			<IconInfo style={{ height: "60px", fill: "#5576c7" }} />
			<div>
				<h1 style={{ fontSize: "14px", letterSpacing: "5px", marginBottom: "5px" }}>
					RESET PASSWORD REQUEST
				</h1>
				<p style={{ fontSize: "14px", letterSpacing: "0px", lineHeight: "18px" }}>
					An email with a link will be sent to your email address for confirmation. Continue?
				</p>
			</div>
		</div>
	);
};

export default function Login() {
	return (
		<>
			<Particles />
			<LoginForm />
		</>
	);
}
