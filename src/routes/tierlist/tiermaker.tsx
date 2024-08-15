// src/App.tsx
import Search from "@/components/tiermaker/Search";
import { TierList } from "@/components/tiermaker/TierList";
import { Image, Tier } from "@/components/tiermaker/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const ipAddrPort = "http://localhost:3000";

// test link https://image.tmdb.org/t/p/w300//p2W0wdiy7QyZ6mtFCVLIPUFCBfD.jpg

export const Route = createFileRoute("/tierlist/tiermaker")({
	component: TierMaker,
});

const fetchTierImages = async (
	type: "actors" | "movies",
	name: string,
	page: number
) => {
	try {
		const response = await fetch(
			`${ipAddrPort}/api/tmdb/${type}/${name}?page=${page}`,
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

function TierMaker() {
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

	const initialTiers: Tier[] = [
		{ id: "1", name: "S", color: "bg-green-600" },
		{ id: "2", name: "A", color: "bg-yellow-300" },
		{ id: "3", name: "B", color: "bg-yellow-500" },
		{ id: "4", name: "C", color: "bg-blue-400" },
		{ id: "5", name: "D", color: "bg-red-600" },
	];
	const [title, setTitle] = useState<string>("Bollytics Tier List");
	const [tiers, setTiers] = useState<Tier[]>(initialTiers);
	const [images, setImages] = useState<Record<string, Image>>({});

	useEffect(() => {
		console.log(tiers);
		console.log(images);
		console.log(title);
	}, [tiers]);

	return (
		<div className='min-h-screen  text-white'>
			<div className='container mx-auto p-4 sm:p-8'>
				<div className='flex flex-col lg:flex-row gap-8'>
					<div className='w-full'>
						<TierList
							initialImages={tierImages}
							images={images}
							setImages={setImages}
							tiers={tiers}
							setTiers={setTiers}
							title={title}
							setTitle={setTitle}
						/>
					</div>
					<div>
						<Search
							searchResults={searchResults}
							setTierImageQuery={setTierImageQuery}
							onSearch={handleSearch}
							onAddImage={handleAddImage}
							tierImageQuery={tierImageQuery}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
