// src/App.tsx
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Search from "./Search";
import { Image, TierList } from "./TierList";

const initialImages: Image[] = [
	{
		id: "1",
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Vijay_at_Protest_of_the_Nadigar_Sangam.jpg/220px-Vijay_at_Protest_of_the_Nadigar_Sangam.jpg",
		tier: "start",
	},
	{
		id: "2",
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Sivakarthikeyan_at_Behindwoods_2024.jpg/220px-Sivakarthikeyan_at_Behindwoods_2024.jpg",
		tier: "start",
	},
	{
		id: "3",
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Ajith_Kumar_at_Irungattukottai_Race_Track.jpg/220px-Ajith_Kumar_at_Irungattukottai_Race_Track.jpg",
		tier: "start",
	},
	{
		id: "4",
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Vijay_Sethupathi_at_the_premiere_of_Merry_Christmas_%28cropped%29.jpg/220px-Vijay_Sethupathi_at_the_premiere_of_Merry_Christmas_%28cropped%29.jpg",
		tier: "start",
	},
	{
		id: "5",
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Rajinikanth_Felicitates_Writer_Kalaignanam_1.jpg/220px-Rajinikanth_Felicitates_Writer_Kalaignanam_1.jpg",
		tier: "start",
	},
];

const ipAddrPort = "http://localhost:3000";

const fetchTierImages = async (
	type: "actors" | "movies",
	name: string,
	page: number
) => {
	try {
		const response = await fetch(`${ipAddrPort}/${type}/${name}?page=${page}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const res = await response.json();
		return res;
	} catch (error) {
		console.error(error, "error here");
	}
};

function HomeLander() {
	const [tierImageQuery, setTierImageQuery] = useState<{
		type: "actors" | "movies";
		name: string;
		page: number;
	}>({
		type: "actors",
		name: "",
		page: 1,
	});

	const { data: tierImages, refetch } = useQuery({
		queryKey: ["tierImages", tierImageQuery],
		queryFn: async () => {
			const res = await fetchTierImages(
				tierImageQuery.type,
				tierImageQuery.name,
				tierImageQuery.page
			);
			return res;
		},
		enabled: !!tierImageQuery.name,
	});

	const handleSearch = () => {
		refetch();
	};

	return (
		<div className='min-h-screen bg-gray-900 text-white'>
			<div className='container mx-auto p-8'>
				<div className='flex gap-8'>
					<TierList initialImages={initialImages} />
					<Search
						tierImages={tierImages}
						setTierImageQuery={setTierImageQuery}
						onSearch={handleSearch}
					/>
				</div>
			</div>
		</div>
	);
}

export default HomeLander;
