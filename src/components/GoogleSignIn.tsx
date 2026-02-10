"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

declare global {
	interface Window {
		google?: any;
	}
}

interface GoogleSignInProps {
	onSuccess?: (response: any) => void;
	onError?: (error: any) => void;
	text?: "signin_with" | "signup_with" | "continue_with";
	className?: string;
}

export default function GoogleSignIn({
	onSuccess,
	onError,
	text = "signin_with",
	className = "",
}: GoogleSignInProps) {
	const router = useRouter();

	useEffect(() => {
		// Load Google Sign-In script
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);

		script.onload = () => {
			if (window.google) {
				window.google.accounts.id.initialize({
					client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
					callback: handleCredentialResponse,
				});

				window.google.accounts.id.renderButton(
					document.getElementById("google-signin-button"),
					{
						theme: "outline",
						size: "large",
						text: text,
						width: "100%",
						logo_alignment: "left",
					},
				);
			}
		};

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const handleCredentialResponse = async (response: any) => {
		try {
			// Send the credential to your backend
			const res = await fetch("/api/auth/google", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					credential: response.credential,
				}),
			});

			const data = await res.json();

			if (data.status === "success") {
				// Store token in localStorage
				localStorage.setItem("token", data.token);
				localStorage.setItem(
					"user",
					JSON.stringify({
						id: data.userId,
						email: data.email,
						firstName: data.firstName,
						lastName: data.lastName,
						role: data.role,
						picture: data.picture,
					}),
				);

				// Call onSuccess callback if provided
				if (onSuccess) {
					onSuccess(data);
				}

				// Redirect to home page
				router.push("/");
			} else {
				throw new Error(data.message || "Google sign-in failed");
			}
		} catch (error) {
			console.error("Google sign-in error:", error);
			if (onError) {
				onError(error);
			}
		}
	};

	return (
		<div className={className}>
			<div id="google-signin-button" className="w-full"></div>
		</div>
	);
}