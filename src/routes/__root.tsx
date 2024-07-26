import Navbar from "@/components/navbar/Navbar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
	component: () => (
		<div
			className='dark min-h-screen bg-cover bg-fixed bg-center bg-no-repeat'
			style={{ backgroundImage: 'url("/twbg2.jpg")' }}
		>
			<Navbar />
			<main className='pt-16'>
				<Outlet />
			</main>
			<TanStackRouterDevtools />
		</div>
	),
});
