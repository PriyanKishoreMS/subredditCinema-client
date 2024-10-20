import { Card, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

export const Route = createFileRoute("/auth-callback")({
	component: AuthCallback,
});

function AuthCallback() {
	const navigate = useNavigate({ from: "/auth-callback" });
	const { login } = useAuth();
	const [cookies, _, removeCookie] = useCookies(["tokens"]);

	useEffect(() => {
		const processAuth = async () => {
			const tokens = await cookies.tokens;
			if (!tokens) {
				console.log("No tokens found in cookies");
				navigate({ to: "/" });
				return;
			}
			try {
				const { accessToken, refreshToken, user } = tokens;
				const { Username: username, RedditUID: id, Avatar: avatar } = user;
				login({ accessToken, refreshToken }, { username, id, avatar });
				removeCookie("tokens");
				navigate({ to: "/" });
			} catch (error) {
				console.error("Error processing auth tokens:", error);
				navigate({ to: "/" });
			}
		};

		processAuth();
	}, [cookies, login, navigate, removeCookie]);

	return (
		<Card>
			<CardTitle>Authenticating...</CardTitle>
		</Card>
	);
}

export default AuthCallback;
