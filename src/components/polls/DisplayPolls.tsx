import Login from "@/components/navbar/LoginSheet";
import Logout from "@/components/navbar/LogoutSheet";
import SubNavbar from "@/components/navbar/SubNavbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { PlusIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { Skeleton } from "../ui/skeleton";
import CreatePollSheet from "./CreatePollSheet";
import PollCard from "./PollCard";
import { PollsResponse } from "./types";

const ipAddrPort = "http://localhost:3000";

const fetchPolls = async (
	page: number,
	sub: string
): Promise<PollsResponse> => {
	const response = await fetch(
		`${ipAddrPort}/api/poll/${sub}/all?page=${page}`
	);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return response.json();
};

const PostVote = async (pollId: string, optionId: string) => {
	try {
		const response = await fetch(
			`${ipAddrPort}/api/poll/vote/${pollId}/${optionId}`,
			{
				method: "POST",
			}
		);
		const res = await response.json();
		return res;
	} catch (error) {
		console.error(error, "error here");
	}
};

const PollsSkeleton: React.FC<{ state: string }> = ({ state }) => {
	return (
		<div className='flex flex-col'>
			<Skeleton className='flex flex-col items-start p-5 w-full h-[500px] shadow-lg'>
				<div className='flex justify-start w-full space-x-5 items-center'>
					<Skeleton className='w-11 h-10 rounded-full' />
					<div className='flex flex-col w-full gap-3'>
						<Skeleton className='w-full h-5 rounded-xl' />
						<Skeleton className='w-3/4 h-5 rounded-xl' />
					</div>
				</div>
				<Skeleton className='h-full p-5 mt-5  w-full '>
					<h1 className='text-xl text-gray-500'>{state}</h1>
				</Skeleton>
			</Skeleton>
		</div>
	);
};

const DisplayPolls = () => {
	const [sub, setSub] = useState("kollywood");
	const [page, setPage] = React.useState(1);
	const [isCreatePollOpen, setIsCreatePollOpen] = useState(false);
	const [isLogSheetOpen, setIsLogSheetOpen] = useState(false);
	const { user } = useAuth();

	const { data, isLoading, isError } = useQuery<PollsResponse, Error>({
		queryKey: ["polls", page, sub],
		queryFn: () => fetchPolls(page, sub),
	});

	const queryClient = useQueryClient();
	const { mutateAsync: addVoteMutation } = useMutation({
		mutationFn: async ({
			pollId,
			optionId,
		}: {
			pollId: string;
			optionId: string;
		}) => {
			return await PostVote(pollId, optionId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["polls"] });
		},
	});

	const polls = data?.polls || [];
	const metadata = data?.metadata;

	return (
		<>
			<div className='min-h-screen'>
				<div
					className={`flex flex-col md:flex-row ${isCreatePollOpen && "blur-xl ease-in-out duration-100"}`}
				>
					<SubNavbar sub={sub} setSub={setSub} setOpen={setIsLogSheetOpen} />
					<div className={`flex-1 p-6 `}>
						<div className='flex flex-col items-center lg:flex-row lg:justify-center mb-5 gap-3'>
							<div className='w-full lg:max-w-3xl'>
								<h1 className='text-3xl text-white font-bold mb-6 text-center'>
									{sub.charAt(0).toUpperCase() + sub.slice(1)} Polls
								</h1>
								<div className='flex flex-col gap-4'>
									{isLoading &&
										Array.from({ length: 5 }).map((_, i) => (
											<PollsSkeleton key={i} state='Loading...' />
										))}{" "}
									{isError && <PollsSkeleton state={"Error..."} />}
									{polls.map(poll => (
										<PollCard
											key={poll.id}
											poll={poll}
											addVoteMutation={addVoteMutation}
										/>
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
						<div className='fixed md:bottom-12 md:right-12 bottom-2 right-2'>
							<Button
								size='lg'
								variant='secondary'
								className='hidden md:flex bg-blue-500 hover:bg-blue-600 font-bold py-4 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 items-center'
								onClick={() => setIsCreatePollOpen(true)}
							>
								<PlusIcon className='h-5 w-5 mr-2' />
								<h1 className='text-md'>Create new poll</h1>
							</Button>
							<Button
								size='default'
								variant='secondary'
								className='md:hidden bg-blue-500 hover:bg-blue-600 font-bold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105'
								onClick={() => setIsCreatePollOpen(true)}
							>
								<PlusIcon className='h-4 w-4 mr-2' />
								Add
							</Button>
						</div>
					</div>
				</div>
				<CreatePollSheet
					isOpen={isCreatePollOpen}
					onClose={() => setIsCreatePollOpen(false)}
				/>
			</div>
			{user ? (
				<Logout
					isOpen={isLogSheetOpen}
					setIsOpen={setIsLogSheetOpen}
					onClose={() => setIsLogSheetOpen(false)}
				/>
			) : (
				<Login
					isOpen={isLogSheetOpen}
					setIsOpen={setIsLogSheetOpen}
					onClose={() => setIsLogSheetOpen(false)}
				/>
			)}
		</>
	);
};

export default DisplayPolls;
