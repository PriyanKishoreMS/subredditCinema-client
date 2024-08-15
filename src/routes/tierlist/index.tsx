import Login from "@/components/navbar/LoginSheet";
import Logout from "@/components/navbar/LogoutSheet";
import SubNavbar from "@/components/navbar/SubNavbar";
import TierCard from "@/components/tiermaker/TierCard";
import { TierListsResponse } from "@/components/tiermaker/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/utils";
import { PlusIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";

export const Route = createFileRoute("/tierlist/")({
	component: Tierlist,
});

function Tierlist() {
	const [sub, setSub] = useState("kollywood");
	const [page, setPage] = useState(1);
	const [isLogSheetOpen, setIsLogSheetOpen] = useState(false);
	const { user } = useAuth();
	const { fetchWithoutToken } = useApi();

	const { data, error } = useQuery<TierListsResponse, Error>({
		queryKey: ["tierlists", sub, page],
		queryFn: async () => {
			const response = await fetchWithoutToken(
				`/api/tierlist/all/${sub}?page=${page}&page_size=12`
			);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		},
	});

	if (error) {
		console.error("Error fetching tier lists:", error);
	}

	const metadata = data?.metadata;

	console.log(data, "data");

	const categories = ["kollywood", "tollywood", "MalayalamMovies", "bollywood"];
	const tierlists = data?.tier_lists || [];
	console.log(tierlists, "tierlists");

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
						<h1 className='text-3xl text-white font-bold mb-6 text-center'>
							{sub.charAt(0).toUpperCase() + sub.slice(1)} {"  "} Tierlists
						</h1>
						<div className='h-3/4 flex justify-between flex-col'>
							<div className='flex flex-col items-center justify-center lg:flex-row lg:justify-center mb-5'>
								<div className='w-full lg:max-w-7xl grid md:grid-cols-3 sm:grid-cols-2 gap-10'>
									{tierlists.map(tierlist => (
										<Link
											key={tierlist.id}
											to={`/tierlist/${tierlist.id}`}
											params={{ surveyId: tierlist.id.toString() }}
										>
											<TierCard key={tierlist.id} tierlist={tierlist} />
										</Link>
									))}
								</div>
							</div>
							<div className='flex justify-center mt-6 space-x-2'>
								<Button
									onClick={() => setPage(p => Math.max(1, p - 1))}
									disabled={page === 1}
									variant='outline'
									className='text-white'
								>
									<FaChevronLeft className='h-4 w-4 mr-2' /> Previous
								</Button>
								<Button
									onClick={() => setPage(p => p + 1)}
									disabled={page === metadata?.last_page}
									variant='outline'
									className='text-white'
								>
									Next <FaChevronRight className='h-4 w-4 ml-2' />
								</Button>
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