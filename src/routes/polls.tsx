import DisplayPolls from "@/components/polls/DisplayPolls";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import ReactGA from "react-ga4";

export const Route = createFileRoute("/polls")({
	component: Polls,
});

function Polls() {
	useEffect(() => {
		console.log("Hitting the polls", window.location.pathname);

		ReactGA.send({
			hitType: "pageview",
			page: window.location.pathname,
			title: "Polls",
		});
	}, []);

	return (
		<>
			<DisplayPolls />
		</>
	);
}
