import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFutureTime, formatPastTime } from "@/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import React from "react";
import { Survey } from "./types";

interface SurveyCardProps {
	survey: Survey;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ survey }) => {
	const { value: createdTimeValue, unit: createdTimeUnit } = formatPastTime(
		survey.created_at
	);

	const endTimeValue = formatFutureTime(survey.end_time);
	const fallbackAvatar = "./public/fallbacksnoovatar.png";

	return (
		<Card className='group hover:shadow-lg transition-all duration-300 bg-gray-900/70 backdrop-blur-md border-gray-700 overflow-hidden cursor-pointer hover:scale-[1.03]'>
			{/* <div className='absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-30 transition-opacity duration-300' /> */}
			<CardHeader className='relative'>
				<div className='flex justify-between items-center'>
					<div className='flex items-center space-x-4'>
						<Avatar>
							<AvatarImage
								src={survey.avatar || fallbackAvatar}
								alt={survey.username}
							/>
							<AvatarFallback>{survey.username}</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle className='text-white'>u/{survey.username}</CardTitle>
							<Badge
								variant='secondary'
								className='bg-gray-800 text-gray-300 group-hover:bg-orange-600 group-hover:text-white mt-2'
							>
								r/{survey.subreddit}
							</Badge>
						</div>
					</div>
					<div>
						<h1 className='mt-2 ml-2 text-gray-400 text-xs'>
							#Response: {survey.total_responses}
						</h1>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<CardTitle className='mb-4'>{survey.title}</CardTitle>
				{survey.description && (
					<p className='text-gray-300 mb-4'>{survey.description}</p>
				)}
				<div className='flex justify-between items-center text-sm text-gray-400'>
					<div className='flex items-center'>
						{/* <CalendarIcon className='w-4 h-4 mr-1 text-green-500' /> */}
						{createdTimeValue}
						{createdTimeUnit} ago
					</div>
					<div className='flex items-center'>
						<CalendarIcon className='w-4 h-4 mx-1 text-red-500' />
						{endTimeValue}
					</div>
					{/* {survey.total_responses} */}
				</div>
			</CardContent>
		</Card>
	);
};

export default SurveyCard;
