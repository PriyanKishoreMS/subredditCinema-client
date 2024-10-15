import Search from "@/components/tiermaker/Search";
import { TierList } from "@/components/tiermaker/TierList";
import { Image, Tier, TierlistResponse } from "@/components/tiermaker/types";
import { useApi } from "@/utils";
import { BASE_URL as ipAddrPort } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const Route = createFileRoute("/tierlist/$tierlistId")({
	component: TierListPage,
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

function TierListPage() {
	const { tierlistId } = Route.useParams();
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

	console.log(tierlistId);

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

	const { fetchWithoutToken } = useApi();

	const { data: tierlist } = useQuery<TierlistResponse, Error>({
		queryKey: ["tierlist", tierlistId],
		queryFn: async () => {
			const response = await fetchWithoutToken(`/api/tierlist/${tierlistId}`);
			if (!response.ok) {
				throw new Error("Failed to fetch tierlist");
			}
			return response.json();
		},
	});

	useEffect(() => {
		if (tierlist) {
			setTitle(tierlist.title);

			console.log(tierlist, "tierlist");

			const newTiers = tierlist.tiers.map((tier, index) => ({
				id: String(index + 1),
				name: tier.label,
				color: tier.color.startsWith("bg-") ? tier.color : `bg-${tier.color}`,
			}));
			setTiers(newTiers);

			tierlist.urls.forEach((url, index) => {
				handleAddImage({
					id: uuidv4(),
					image: url,
					name: `Image ${index + 1}`,
				});
			});
		}
	}, [tierlist]);

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
							setTierImages={setTierImages}
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
