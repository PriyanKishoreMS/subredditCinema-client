import Dashboard from "@/components/subAnalytics/Dashboard";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import ReactGA from "react-ga4";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	useEffect(() => {
		console.log("Hitting the dashboard", window.location.pathname);

		ReactGA.send({
			hitType: "pageview",
			page: window.location.pathname,
			title: "Analytic Dashboard",
		});
	}, []);

	return (
		<div className='min-h-screen'>
			<Dashboard />
		</div>
	);
}
