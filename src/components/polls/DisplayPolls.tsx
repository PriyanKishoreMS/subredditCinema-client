import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import SubNavbar from "../navbar/SubNavbar";
import { Skeleton } from "../ui/skeleton";
import PollCard from "./PollCard";
import { PollsResponse } from "./types";

const ipAddrPort = "http://localhost:3000";

const fetchPolls = async (page: number): Promise<PollsResponse> => {
	const response = await fetch(
		`${ipAddrPort}/api/poll/kollywood/all?page=${page}`
	);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return response.json();
};

const PollsSkeleton: React.FC<{ state: string }> = ({ state }) => {
	return (
		<div className='flex flex-col'>
			<Skeleton className='flex flex-col items-start p-5 lg:w-48 lg:h-64 w-80 h-36 shadow-lg'>
				<h1 className='text-xl text-gray-500'>{state}</h1>
			</Skeleton>
		</div>
	);
};

const DisplayPolls = () => {
	const [sub, setSub] = useState("kollywood");
	const [page, setPage] = React.useState(1);

	const { data, isLoading, isError, error } = useQuery<PollsResponse, Error>({
		queryKey: ["polls", page],
		queryFn: () => fetchPolls(page),
	});

	if (isLoading) return <PollsSkeleton state='Loading...' />;
	if (isError)
		return (
			<div className='text-center text-red-500'>Error: {error.message}</div>
		);

	const polls = data?.polls || [];
	const metadata = data?.metadata;

	return (
		<>
			<div className='min-h-screen'>
				<div className='flex flex-col md:flex-row'>
					<SubNavbar sub={sub} setSub={setSub} />
					<div className='flex-1 p-6'>
						<div className='flex flex-col items-center lg:flex-row lg:justify-center mb-5 gap-3'>
							<div className='w-full lg:max-w-3xl'>
								<h1 className='text-3xl text-white font-bold mb-6 text-center'>
									{sub} Polls
								</h1>
								<div className='flex flex-col gap-4'>
									{polls.map(poll => (
										<PollCard key={poll.id} poll={poll} />
									))}
								</div>
								<div className='flex justify-center mt-6 space-x-2'>
									<Button
										onClick={() => setPage(p => Math.max(1, p - 1))}
										disabled={page === 1}
										variant='outline'
										className='text-white'
									>
										<FaChevronLeft className='h-4 w-4 mr-2' /> Previous
									</Button>
									<Button
										onClick={() => setPage(p => p + 1)}
										disabled={page === metadata?.last_page}
										variant='outline'
										className='text-white'
									>
										Next <FaChevronRight className='h-4 w-4 ml-2' />
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DisplayPolls;
