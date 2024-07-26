import Dashboard from "@/components/subAnalytics/Dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className='min-h-screen'>
			<Dashboard />
		</div>
	);
}
