import React, { useState } from "react";

type SearchProps = {
	searchResults: any;

	setTierImageQuery: React.Dispatch<
		React.SetStateAction<{
			type: "actors" | "movies";
			name: string;
			page: number;
		}>
	>;
	onSearch: () => void;
	onAddImage: (image: any) => void;
};

const Search: React.FC<SearchProps> = ({
	searchResults,
	setTierImageQuery,
	onSearch,
	onAddImage,
}) => {
	const [searchType, setSearchType] = useState<"actors" | "movies">("actors");
	const [searchTerm, setSearchTerm] = useState("");

	const handleTierSearchSubmit = () => {
		setTierImageQuery(prev => ({
			...prev,
			type: searchType,
			name: searchTerm,
			page: 1,
		}));
		onSearch();
	};

	console.log(searchResults, "searchResults");

	return (
		<div className='lg:w-64 w-full bg-gray-800 bg-opacity-50 border-[0.5px] border-gray-500 backdrop-blur-md p-4 flex flex-col h-[750px] rounded-lg shadow-lg'>
			<div className='mb-4'>
				<div className='flex justify-center gap-4 mb-4'>
					<label className='inline-flex items-center'>
						<input
							type='radio'
							className='form-radio text-blue-600'
							name='type'
							value='actors'
							checked={searchType === "actors"}
							onChange={() => setSearchType("actors")}
						/>
						<span className='ml-2 text-white text-sm'>Actor</span>
					</label>
					<label className='inline-flex items-center'>
						<input
							type='radio'
							className='form-radio text-blue-600'
							name='type'
							value='movies'
							checked={searchType === "movies"}
							onChange={() => setSearchType("movies")}
						/>
						<span className='ml-2 text-white text-sm'>Movie</span>
					</label>
				</div>
				<div className='flex flex-col'>
					<input
						className='w-full bg-gray-700 text-white border border-gray-600 rounded-t-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500'
						type='text'
						// color='primary'
						placeholder={`Search ${
							searchType === "actors" ? "actor" : "movie"
						}`}
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
					<button
						className='w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-b-lg transition duration-300 ease-in-out text-sm'
						onClick={handleTierSearchSubmit}
					>
						Search
					</button>
				</div>
			</div>
			<div className='overflow-y-auto flex-grow pr-2'>
				{searchResults ? (
					Array.isArray(searchResults) ? (
						searchResults.length > 0 ? (
							<div className='grid grid-cols-2 gap-2'>
								{searchResults.map((image: any) => (
									<div
										key={image.id}
										className='bg-gray-700 rounded-lg overflow-hidden cursor-pointer'
										onClick={() => onAddImage(image)}
									>
										<img
											src={image.image}
											alt={image.name}
											className='w-full h-24 object-cover'
										/>
										<p className='p-1 text-center text-white truncate text-xs'>
											{image.name}
										</p>
									</div>
								))}
							</div>
						) : (
							<p className='text-white text-center'>No results found.</p>
						)
					) : (
						<p className='text-white text-center'>
							{searchResults.message ||
								"An error occurred while fetching results."}
						</p>
					)
				) : (
					<p className='text-white text-center'>Search for actors or movies.</p>
				)}
			</div>
		</div>
	);
};

export default Search;
