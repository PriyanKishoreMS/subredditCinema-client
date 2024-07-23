import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className='min-h-screen bg-[url("/public/allbanneredited.png")]'>
			<h3>Welcome Home!</h3>
		</div>
	);
}
