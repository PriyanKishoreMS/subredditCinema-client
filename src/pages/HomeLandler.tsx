// src/App.tsx
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Search from "./Search";
import { Image, TierList } from "./TierList";

const ipAddrPort = "http://localhost:3000";

const fetchTierImages = async (
	type: "actors" | "movies",
	name: string,
	page: number
) => {
	try {
		const response = await fetch(
			`${ipAddrPort}/api/${type}/${name}?page=${page}`,
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

	const [tierImages, setTierImages] = useState<Image[]>([]);

	const { data: searchResults, refetch } = useQuery({
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

	const handleAddImage = (image: any) => {
		const newImage: Image = {
			id: image.id,
			src: image.image,
			tier: "start",
			name: image.name,
		};
		setTierImages(prev => {
			const isExisting = prev.some(img => img.src === newImage.src);
			if (isExisting) return prev;
			return [...prev, newImage];
		});
	};

	return (
		<div className='min-h-screen bg-gray-900 text-white'>
			<div className='container mx-auto p-4 sm:p-8'>
				<div className='flex flex-col lg:flex-row gap-8'>
					<div className='w-full'>
						<TierList initialImages={tierImages} />
					</div>
					<div>
						<Search
							searchResults={searchResults}
							setTierImageQuery={setTierImageQuery}
							onSearch={handleSearch}
							onAddImage={handleAddImage}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default HomeLander;
