import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import ReactGA from "react-ga4";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const measurementID = "G-4C5C8L7KLQ";
ReactGA.initialize(measurementID);

// Render the app
const rootElement = document.getElementById("root")!;

if (process.env.NODE_ENV === "production") {
	console.log = () => {};
	console.error = () => {};
	console.debug = () => {};
}

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	const queryClient = new QueryClient();

	root.render(
		<StrictMode>
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</AuthProvider>
		</StrictMode>
	);
}
