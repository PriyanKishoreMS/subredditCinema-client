import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomeLander from "./pages/HomeLandler";

function App() {
	const queryClient = new QueryClient();
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<NextUIProvider>
					<HomeLander />
				</NextUIProvider>
			</QueryClientProvider>
		</>
	);
}

export default App;
