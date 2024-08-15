import Login from "@/components/navbar/LoginSheet";
import Logout from "@/components/navbar/LogoutSheet";
import SubNavbar from "@/components/navbar/SubNavbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { PlusIcon } from "@radix-ui/react-icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/tierlist/")({
	component: Tierlist,
});

function Tierlist() {
	const [sub, setSub] = useState("kollywood");
	// const [page, setPage] = useState(1);
	const [isLogSheetOpen, setIsLogSheetOpen] = useState(false);
	const { user } = useAuth();

	const categories = ["kollywood", "tollywood", "MalayalamMovies", "bollywood"];

	return (
		<>
			<div className='min-h-screen'>
				<div className={`flex flex-col md:flex-row`}>
					<SubNavbar
						sub={sub}
						cateogoies={categories}
						setSub={setSub}
						setOpen={setIsLogSheetOpen}
					/>
					<div className={`flex-1 p-6 `}>
						<div className='flex flex-col items-center lg:flex-row lg:justify-center mb-5 gap-3'>
							<div className='w-full lg:max-w-3xl'>
								<h1 className='text-3xl text-white font-bold mb-6 text-center'>
									{sub.charAt(0).toUpperCase() + sub.slice(1)} {"  "} Tierlists
								</h1>
							</div>
						</div>
						<div className='fixed md:bottom-12 md:right-12 bottom-2 right-2'>
							<Button
								size='lg'
								variant='secondary'
								className='hidden md:flex bg-blue-500 hover:bg-blue-600 font-bold py-4 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 items-center'
							>
								<Link
									to='/tierlist/tiermaker'
									className='flex flex-row items-center justify-center'
								>
									<PlusIcon className='h-5 w-5 mr-2' />
									<h1 className='text-md'>Create new Tierlist</h1>
								</Link>
							</Button>
							<Button
								size='default'
								variant='secondary'
								className='md:hidden bg-blue-500 hover:bg-blue-600 font-bold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105'
							>
								<Link
									to='/tierlist/tiermaker'
									className='flex flex-row items-center justify-center'
								>
									<PlusIcon className='h-4 w-4 mr-2' />
									Add
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
			{user ? (
				<Logout
					setIsOpen={setIsLogSheetOpen}
					isOpen={isLogSheetOpen}
					onClose={() => setIsLogSheetOpen(false)}
				/>
			) : (
				<Login
					setIsOpen={setIsLogSheetOpen}
					isOpen={isLogSheetOpen}
					onClose={() => setIsLogSheetOpen(false)}
				/>
			)}
		</>
	);
}
