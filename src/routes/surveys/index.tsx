import DisplaySurveys from "@/components/surveys/DisplaySurveys";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import ReactGA from "react-ga4";

export const Route = createFileRoute("/surveys/")({
	component: Surveys,
});

function Surveys() {
	useEffect(() => {
		console.log("Hitting the surveys", window.location.pathname);
		ReactGA.send({
			hitType: "pageview",
			page: window.location.pathname,
			title: "Surveys",
		});
	}, []);

	return (
		<>
			<DisplaySurveys />
		</>
	);
}
