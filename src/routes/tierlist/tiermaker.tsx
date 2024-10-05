import Search from "@/components/tiermaker/Search";
import { TierList } from "@/components/tiermaker/TierList";
import { Image, Tier, tierListData } from "@/components/tiermaker/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/utils";
import { BASE_URL as ipAddrPort } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
	const { user } = useAuth();

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
	const [category, setCategory] = useState<string>("kollywood");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCategory(e.target.value);
	};

	const { fetchWithToken } = useApi();

	const createTierList = async (data: tierListData) => {
		const response = await fetchWithToken("/api/tierlist/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		const res = await response.json();
		console.log(res);
		return res;
	};

	const createTierListMutation = useMutation({
		mutationFn: createTierList,
		onSuccess: (data: any) => {
			alert("Tier list created successfully");
			console.log("Tier list created successfully:", data);
		},
	});

	const handleSubmit = () => {
		const urls = Object.values(images).map(image => image.src);

		const tierListData = {
			title,
			subreddit: category,
			tiers: tiers.map(tier => ({
				label: tier.name,
				color: tier.color,
			})),
			urls,
		};

		createTierListMutation.mutate(tierListData);
	};

	useEffect(() => {
		console.log(tiers);
		console.log(images);
		console.log(title);
		console.log(category);
	}, [tiers, category]);

	const subreddits = ["kollywood", "tollywood", "bollywood", "MalayalamMovies"];

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
						<div className='flex flex-col items-center justify-center mt-5'>
							<div className='flex flex-col items-center justify-center bg-slate-700 bg-opacity-80 backdrop-blur-md rounded-xl px-8 pt-8 pb-4 max-w-5xl w-11/12 pr-12'>
								<div className='flex flex-col items-center justify-between w-full'>
									<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
										{subreddits.map(sub => (
											<label
												key={sub}
												className='flex items-center space-x-2 cursor-pointer'
											>
												<input
													type='radio'
													name='subreddit'
													value={sub}
													checked={category === sub}
													onChange={handleInputChange}
													className='form-radio text-blue-500'
												/>
												<span>{sub}</span>
											</label>
										))}
									</div>
									<Button
										onClick={handleSubmit}
										disabled={createTierListMutation.isPending || !user}
										className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full mt-4'
									>
										{!!user
											? createTierListMutation.isPending
												? "Submitting..."
												: "Submit Tier List"
											: "Verify to Submit"}
									</Button>
									<p className='text-slate-400 font-light mt-5'>
										<span className='bg-orange-500 text-white p-0.5 italic'>
											NOTE:
										</span>
										{"  "}
										Select a subreddit to post your tier list to. You can only
										select one subreddit.
									</p>
								</div>
							</div>
						</div>
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
