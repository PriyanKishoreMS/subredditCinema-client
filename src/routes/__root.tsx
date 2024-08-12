import Login from "@/components/navbar/LoginSheet";
import Logout from "@/components/navbar/LogoutSheet";
import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createRootRoute({
	component: RootRoute,
});

function RootRoute() {
	const { user } = useAuth();
	const [isLogSheetOpen, setIsLogSheetOpen] = useState(false);
	return (
		<div
			className='dark min-h-screen bg-cover bg-fixed bg-center bg-no-repeat bg-gradient-to-br from-gray-900 via-blue-950 to-gray-950'
			style={{ backgroundImage: 'url("/twbg2.jpg")' }}
		>
			<Navbar setOpen={setIsLogSheetOpen} />
			<main className='pt-16'>
				<Outlet />
				{user ? (
					<Logout
						isOpen={isLogSheetOpen}
						setIsOpen={setIsLogSheetOpen}
						onClose={() => setIsLogSheetOpen(false)}
					/>
				) : (
					<Login
						setIsOpen={setIsLogSheetOpen}
						isOpen={isLogSheetOpen}
						onClose={() => setIsLogSheetOpen(false)}
					/>
				)}
			</main>
		</div>
	);
}
