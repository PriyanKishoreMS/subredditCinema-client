import DeleteSheet from "@/components/DeleteSheet";
import { Poll } from "@/components/polls/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { formatFutureTime, formatPastTime, useApi } from "@/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
	UseMutateAsyncFunction,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import React from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";

const PollCard: React.FC<{
	poll: Poll;
	signedIn: boolean;
	onClick: () => void;
	addVoteMutation: UseMutateAsyncFunction<
		any,
		Error,
		{
			pollId: string;
			optionId: string;
		},
		unknown
	>;
}> = ({ poll, addVoteMutation, onClick: setLoginSheetOpen, signedIn }) => {
	const totalVotes = poll.total_votes;

	const { value: createdTimeValue, unit: createdTimeUnit } = formatPastTime(
		poll.start_time
	);

	const endTimeValue = formatFutureTime(poll.end_time);
	const fallbackAvatar = "./fallbacksnoovatar.png";
	const [showDeleteSheet, setShowDeleteSheet] = React.useState(false);
	const { user } = useAuth();
	const { fetchWithToken } = useApi();
	const queryClient = useQueryClient();

	const deletePollMutation = useMutation({
		mutationFn: async () => {
			const response = await fetchWithToken(`/api/poll/delete/${poll.id}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error("Failed to delete poll");
			}
			const res = response.json();
			return res;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["polls"] });
			alert("Poll deleted successfully");
		},
		onError: error => {
			console.error(error);
			alert("Failed to delete poll");
		},
	});

	return (
		<Card
			key={poll.id}
			className='bg-gray-900/75 backdrop-blur-md p-5 w-full border-gray-700 shadow-lg'
		>
			<CardHeader className='rounded-xl flex flex-row justify-between items-center'>
				<div className='flex items-center space-x-4'>
					<Avatar>
						<AvatarImage
							src={poll.user_avatar || fallbackAvatar}
							alt={poll.user_name}
						/>
						<AvatarFallback>{poll.user_name[0]}</AvatarFallback>
					</Avatar>
					<div>
						<p className='font-semibold'>{poll.user_name}</p>
						<p className='text-sm text-gray-500'>r/{poll.subreddit}</p>
					</div>
				</div>
				<div className='flex flex-col items-end justify-center space-y-1'>
					{user?.id && user.id === poll.reddit_uid && (
						<Button
							type='button'
							variant='destructive'
							size='sm'
							className='gap-2'
							onClick={() => setShowDeleteSheet(true)}
						>
							<MdDeleteForever className='w-4 h-4' /> Delete
						</Button>
					)}
					<CardDescription>#Response: {totalVotes}</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='p-4'>
				<CardTitle>{poll.title}</CardTitle>
				<CardDescription className='mb-4 mt-1'>
					{poll.description}
				</CardDescription>
				{poll.options.map(option => {
					const progressValue = (poll.vote_count[option.id] / totalVotes) * 100;
					const isLightBackgroundText = progressValue > 5;
					const isLightBackgroundNum = progressValue > 95;

					return (
						<div key={option.id} className='mb-5'>
							<button
								className={`relative w-full h-10 hover:bg-slate-700 hover:rounded-md cursor-pointer`}
								onClick={
									signedIn
										? poll.user_vote !== option.id
											? () =>
													addVoteMutation({
														pollId: String(poll.id),
														optionId: String(option.id),
													})
											: undefined
										: setLoginSheetOpen
								}
							>
								<Progress value={progressValue} className='h-full rounded-md' />
								<div className='absolute inset-0 flex items-center justify-between'>
									<span
										className={`text-sm font-medium p-3 ${isLightBackgroundText ? "text-black" : "text-white"} flex gap-2`}
									>
										{option.text}
										{poll.user_vote === option.id && (
											<IoMdCheckmarkCircle className='w-5 h-5 text-green-600' />
										)}
									</span>
									<span
										className={`text-sm font-medium p-3 ${isLightBackgroundNum ? "text-black" : "text-white"}`}
									>
										{poll.vote_count[option.id] === 0
											? 0
											: progressValue.toFixed(1)}
										%
									</span>
								</div>
							</button>
						</div>
					);
				})}
				<div className='flex justify-between items-center text-sm text-gray-400'>
					<div className='flex items-center'>
						{createdTimeValue}
						{createdTimeUnit} ago
					</div>
					<div className='flex items-center'>
						<CalendarIcon className='w-4 h-4 mx-1 text-red-500' />
						{endTimeValue}
					</div>
				</div>
			</CardContent>
			{showDeleteSheet && (
				<DeleteSheet
					setShowDeleteSheet={setShowDeleteSheet}
					deletePollMutation={deletePollMutation}
				/>
			)}
		</Card>
	);
};

export default PollCard;
