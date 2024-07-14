import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomeLander from "./pages/HomeLandler";

function App() {
	const queryClient = new QueryClient();
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<HomeLander />
			</QueryClientProvider>
		</>
	);
}

export default App;
