import DisplaySurveys from "@/components/surveys/DisplaySurveys";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/surveys/")({
	component: Surveys,
});

function Surveys() {
	return (
		<>
			<DisplaySurveys />
		</>
	);
}
