import { createFileRoute } from "@tanstack/react-router";
import Heatmap from "../components/subAnalytics/HeatMap";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className='min-h-screen'>
			<h3>Lawrence Manickam Veedu Enga Iruku</h3>

			<Heatmap />
		</div>
	);
}
