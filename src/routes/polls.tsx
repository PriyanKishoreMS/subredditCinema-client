import DisplayPolls from "@/components/polls/DisplayPolls";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/polls")({
	component: Polls,
});

function Polls() {
	return (
		<>
			<DisplayPolls />
		</>
	);
}
