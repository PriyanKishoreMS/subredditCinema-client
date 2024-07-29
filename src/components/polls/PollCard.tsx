import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import React from "react";

import { Poll } from "./types";

const PollCard: React.FC<{ poll: Poll }> = ({ poll }) => {
	const totalVotes = poll.total_votes;

	return (
		<Card
			key={poll.id}
			className='bg-gray-900/70 backdrop-blur-md p-5 w-full border-gray-700 shadow-lg'
		>
			<CardHeader className='rounded-xl'>
				<div className='flex items-center space-x-4'>
					<Avatar>
						<AvatarImage src={poll.user_avatar} alt={poll.user_name} />
						<AvatarFallback>{poll.user_name[0]}</AvatarFallback>
					</Avatar>
					<div>
						<p className='font-semibold'>{poll.user_name}</p>
						<p className='text-sm text-gray-500'>r/{poll.subreddit}</p>
					</div>
				</div>
			</CardHeader>
			<CardContent className='p-4'>
				<CardTitle className='mb-4'>{poll.title}</CardTitle>
				{poll.options.map(option => (
					<div key={option.id} className='mb-4'>
						<div className='flex justify-between mb-1'>
							<span>{option.text}</span>
							<span>
								{poll.vote_count[option.id] === 0
									? 0
									: (
											((poll.vote_count[option.id] || 0) / totalVotes) *
											100
										).toFixed(1)}
								%
							</span>
						</div>
						<Progress value={(poll.vote_count[option.id] / totalVotes) * 100} />
					</div>
				))}
				<div className='mt-4 text-sm text-gray-500'>
					Total votes: {totalVotes}
				</div>
			</CardContent>
		</Card>
	);
};

export default PollCard;
