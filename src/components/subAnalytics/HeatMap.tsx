import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { FaRedditAlien } from "react-icons/fa";
import { TbEggFilled } from "react-icons/tb";

interface FrequencyData {
	[key: string]: number[];
}

const ipAddrPort = "http://localhost:3000";

const fetchPostFrequency = async (category: string) => {
	try {
		const response = await fetch(
			`${ipAddrPort}/api/reddit/${category}/frequency`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const res = await response.json();
		return res;
	} catch (error) {
		console.error(error, "error here");
		throw error;
	}
};

const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Heatmap: React.FC<{
	sub: string;
}> = ({ sub }) => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["frequency", sub],
		queryFn: () => fetchPostFrequency(sub),
		enabled: !!sub,
	});

	const getColor = (value: number) => {
		if (value > 9) return "bg-green-950";
		const colorMap = {
			1: "bg-green-100",
			2: "bg-green-200",
			3: "bg-green-300",
			4: "bg-green-400",
			5: "bg-green-500",
			6: "bg-green-600",
			7: "bg-green-700",
			8: "bg-green-800",
			9: "bg-green-900",
		};
		return colorMap[value as keyof typeof colorMap] || "bg-green-0";
	};

	const renderHeatmap = (frequencyData: FrequencyData | undefined) => {
		if (!frequencyData) {
			return (
				<div className='flex items-center space-x-6'>
					<Skeleton className='h-12 w-12 rounded-full' />
					<div className='space-y-2'>
						<h1>Loading</h1>
						<Skeleton className='h-4 lg:w-[450px]' />
						<Skeleton className='h-4 lg:w-[840px]' />
					</div>
				</div>
			);
		}

		const days = Object.keys(frequencyData);
		const hours = Array.from({ length: 24 }, (_, i) => i);

		return (
			<div className='flex flex-col lg:flex-row justify-center'>
				<div className='flex lg:flex-col mb-2 lg:mb-0 lg:mr-2 items-center justify-center'>
					<div className='w-10 lg:h-7'></div>
					{days.map(day => (
						<div key={day} className='w-9 h-9 lg:w-10 text-right pr-2'>
							<p>{weekday[parseInt(day)]}</p>
						</div>
					))}
				</div>
				<div className='flex flex-col justify-center items-center lg:flex-row'>
					{hours.map(hour => (
						<div key={hour} className='flex lg:flex-col'>
							<div className='w-7 h-7 mr-2 text-center text-xs'>{hour}</div>
							{days.map(day => {
								const value = frequencyData[day]?.[hour] ?? 0;
								return (
									<HoverCard
										key={`${day}-${hour}`}
										closeDelay={100}
										openDelay={100}
									>
										<HoverCardTrigger>
											<div
												className={`w-7 h-7 mr-2 mb-2 rounded-sm ${getColor(value)} border border-gray-600 flex items-center justify-center ${value > 9 && "border-orange-500"}`}
											>
												{value >= 10 && (
													<span
														className={`text-xs ${value % 10 < 5 ? "font-bold text-orange-300" : "font-black text-orange-600"}`}
													>
														{value}
													</span>
												)}
												{value == 0 && (
													<TbEggFilled className='text-gray-500' size={15} />
												)}
											</div>
										</HoverCardTrigger>
										<HoverCardContent className='w-30'>
											<span>Posted: {value}</span>
										</HoverCardContent>
									</HoverCard>
								);
							})}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className='flex justify-center'>
			<Card className='bg-gray-900/30 backdrop-blur-md p-5 w-full lg:max-w-5xl border-gray-700 shadow-lg'>
				<CardTitle className='text-xl font-bold text-white'>
					<span className='flex items-center'>
						<FaRedditAlien
							size={22}
							className='self-center mr-2 text-orange-500'
						/>
						<span className='text-orange-500'>r/{sub} </span>
						Frequency <span className='bg-red-500 px-1'>Heatmap</span>
					</span>
				</CardTitle>
				<CardDescription className='mb-4'>
					This heatmap shows the frequency of posts posted in r/{sub}
					throughout the week and hours of the day.
				</CardDescription>
				{isLoading ? (
					<div className='flex items-center space-x-6'>
						<Skeleton className='h-12 w-12 rounded-full' />
						<div className='space-y-2'>
							<h1>Loading</h1>
							<Skeleton className='h-4 lg:w-[450px] w-[100px]' />
							<Skeleton className='h-4 lg:w-[840px] w-[260px]' />
						</div>
					</div>
				) : isError ? (
					<div className='text-red-500'>Error fetching data</div>
				) : (
					renderHeatmap(data?.[`${sub}_month_frequency`])
				)}
			</Card>
		</div>
	);
};

export default Heatmap;
