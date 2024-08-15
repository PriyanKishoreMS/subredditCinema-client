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
		if (value > 9) return "bg-transparent";
		const colorMap = {
			1: "bg-lime-900/50 shadow-none",
			2: "bg-lime-800/90 shadow-none",
			3: "bg-lime-700/95 shadow-none",
			4: "bg-lime-600 shadow-none",
			5: "bg-lime-500 shadow-none",
			6: "bg-lime-400 shadow-none",
			7: "bg-lime-300 shadow-none",
			8: "bg-lime-200 shadow-md",
			9: "bg-lime-100 shadow-xl",
		};
		return colorMap[value as keyof typeof colorMap] || "bg-green-0";
	};

	const HeatmapSkeleton: React.FC<{
		state: string;
	}> = ({ state }) => {
		return (
			<div className='flex items-center space-x-6'>
				<div className='space-y-2'>
					<h1 className='text-gray-500 text-xl'>{state}</h1>
					<Skeleton className='h-5 lg:w-[450px]' />
					<Skeleton className='h-5 lg:w-[840px]' />
					<Skeleton className='h-5 lg:w-[450px]' />
					<Skeleton className='h-5 lg:w-[840px]' />
					<Skeleton className='h-5 lg:w-[450px]' />
					<Skeleton className='h-5 lg:w-[840px]' />
					<Skeleton className='h-5 lg:w-[450px]' />
					<Skeleton className='h-5 lg:w-[840px]' />
				</div>
			</div>
		);
	};

	const renderHeatmap = (frequencyData: FrequencyData | undefined) => {
		if (!frequencyData) {
			return <HeatmapSkeleton state='no data' />;
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
							<div className='w-7 h-7 mr-2 text-start text-xs'>
								{hour % 2 == 0 ? (
									<div className='flex flex-row'>
										<p className=' font-bold'>
											{hour % 12 == 0 ? "12" : hour % 12}
										</p>
										<p className='text-gray-300'>{hour < 12 ? "am" : "pm"}</p>
									</div>
								) : (
									""
								)}
							</div>
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
												className={`w-7 h-7 mr-2 mb-2 rounded-sm ${getColor(value)} border ${value <= 9 && value != 0 && "shadow-lime-200 border-green-900/70"} ${value == 0 && "border border-gray-700"} flex items-center justify-center ${value > 9 && "border-orange-500 shadow-xl shadow-orange-400"}`}
											>
												{value >= 10 && (
													<span
														className={`text-xs ${value % 10 < 5 ? "font-bold text-orange-300 shadow-xl shadow-orange-500" : "font-black text-orange-600 shadow-xl shadow-orange-500"}`}
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
			<Card className='bg-slate-900/50 backdrop-blur-md p-5 w-full lg:max-w-5xl border-gray-700 shadow-lg'>
				<CardTitle className='text-xl font-bold text-white'>
					<span className='flex items-center'>
						<FaRedditAlien
							size={22}
							className='self-center mr-2 text-orange-500'
						/>
						<div>
							<span className='text-orange-500'>r/{sub}</span>
							<span>
								{"  "}Frequency {"  "}
							</span>
							<span className='bg-red-500'>Heatmap</span>
						</div>
					</span>
				</CardTitle>
				<CardDescription className='mb-4'>
					This heatmap shows the frequency of posts posted in r/{sub}
					throughout the week and hours of the day.
				</CardDescription>
				{isLoading ? (
					<HeatmapSkeleton state='Loading' />
				) : isError ? (
					<HeatmapSkeleton state='Error' />
				) : (
					renderHeatmap(data?.[`${sub}_month_frequency`])
				)}
			</Card>
		</div>
	);
};

export default Heatmap;
