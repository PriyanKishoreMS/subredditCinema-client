import Login from "@/components/navbar/LoginSheet";
import Logout from "@/components/navbar/LogoutSheet";
import Heatmap from "@/components/subAnalytics/HeatMap";
import RedditPosts from "@/components/subAnalytics/RedditPosts";
import Users from "@/components/subAnalytics/Users";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_URL as ipAddrPort } from "@/utils/api";
import { useState } from "react";
import { BiSolidUpvote } from "react-icons/bi";
import { LuSword } from "react-icons/lu";
import Image from "../Image";
import SubNavbar from "../navbar/SubNavbar";

const Dashboard = () => {
	const [sub, setSub] = useState("kollywood");
	const [isLogSheetOpen, setIsLogSheetOpen] = useState(false);
	const { user } = useAuth();

	return (
		<div className='min-h-screen'>
			<div className='flex flex-col md:flex-row'>
				<SubNavbar sub={sub} setSub={setSub} setOpen={setIsLogSheetOpen} />
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

					<div className='flex flex-col items-center lg:justify-center mb-5 gap-3'>
						<RedditPosts subreddit={sub} category='top' />

						<RedditPosts subreddit={sub} category='controversial' />

						<RedditPosts subreddit={sub} category='top_and_controversial' />

						<RedditPosts subreddit={sub} category='hated' />
					</div>

					<div className='flex flex-col items-center justify-center my-10'>
						<h1 className='text-white italic bg-orange-500 text-3xl'>
							Bros, this is what you've all been talking about for the past 30
							days
						</h1>
						<Image
							src={`${ipAddrPort}/public/wordcloud/${sub}_wordcloud.png`}
							alt='wordcloud'
							className='w-full lg:w-8/12 h-auto rounded-2xl border border-gray-700 opacity-90 hover:scale-105 transition-transform duration-200 cursor-pointer my-5 shadow-lg'
						/>
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
					isOpen={isLogSheetOpen}
					setIsOpen={setIsLogSheetOpen}
					onClose={() => setIsLogSheetOpen(false)}
				/>
			)}
		</div>
	);
};

export default Dashboard;
