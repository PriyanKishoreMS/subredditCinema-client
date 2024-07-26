import Heatmap from "@/components/subAnalytics/HeatMap";
import { useState } from "react";
import { BiSolidUpvote } from "react-icons/bi";
import { LuSword } from "react-icons/lu";
import { Card } from "../ui/card";
import Users from "./Users";

const Dashboard = () => {
	const [sub, setSub] = useState("kollywood");

	return (
		<div className='min-h-screen'>
			<div className='flex flex-col md:flex-row'>
				<Card className='w-50% md:w-64 mx-5 lg:mx-0 h-auto md:h-[calc(100vh-4rem)] overflow-x-auto no-scrollbar lg:overflow-y-auto lg:sticky top-16 left-0 bg-gray-900/30 backdrop-blur-md border-gray-700 shadow-lg z-10'>
					<nav className='flex flex-row justify-evenly md:flex-col md:p-4 p-1 space-x-2 sm:space-x-0 sm:space-y-2'>
						{["kollywood", "tollywood", "MalayalamMovies", "bollywood"].map(
							cat => (
								<button
									key={cat}
									onClick={() => setSub(cat)}
									className={`lg:p-3 p-1 rounded-full font-medium text-center sm:text-left transition-colors duration-200 whitespace-nowrap ${
										sub === cat
											? "bg-orange-500 text-white"
											: "text-gray-300 hover:bg-gray-800/50 hover:text-white"
									}`}
								>
									r/{cat}
								</button>
							)
						)}
					</nav>
				</Card>
				<div className='flex-1 p-6'>
					<div className='flex flex-col items-center lg:flex-row lg:justify-center mb-5 gap-3'>
						<Users
							type='top'
							sub={sub}
							icon={<BiSolidUpvote className='text-green-600' size={20} />}
						/>
						<Users
							type='controversial'
							sub={sub}
							icon={<LuSword className='text-red-500' size={20} />}
						/>
					</div>
					<Heatmap sub={sub} />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
