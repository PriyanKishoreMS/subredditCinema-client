import DeleteSheet from "@/components/DeleteSheet";
import { Survey } from "@/components/surveys/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { formatFutureTime, formatPastTime, useApi } from "@/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { MdDeleteForever } from "react-icons/md";

interface SurveyCardProps {
	survey: Survey;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ survey }) => {
	const { value: createdTimeValue, unit: createdTimeUnit } = formatPastTime(
		survey.created_at
	);

	const endTimeValue = formatFutureTime(survey.end_time);
	const fallbackAvatar = "./fallbacksnoovatar.png";
	const [showDeleteSheet, setShowDeleteSheet] = useState(false);
	const { user } = useAuth();
	const { fetchWithToken } = useApi();
	const queryClient = useQueryClient();

	const deleteSurveyMutation = useMutation({
		mutationFn: async () => {
			const response = await fetchWithToken(`/api/survey/delete/${survey.id}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error("Failed to delete survey");
			}
			const res = response.json();
			return res;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["surveys"] });
			alert("Survey deleted successfully");
		},
		onError: error => {
			console.error(error);
			alert("Failed to delete survey");
		},
	});

	const handleDeleteSurvey = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setShowDeleteSheet(true);
	};

	return (
		<Card className='group hover:shadow-lg transition-all duration-100 bg-gray-900/75 backdrop-blur-md border-gray-700 overflow-hidden cursor-pointer hover:bg-gray-900/50'>
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
					<div className='flex flex-col items-end justify-center space-y-1'>
						{user?.id && user.id === survey.reddit_uid && (
							<Button
								type='button'
								variant='destructive'
								size='sm'
								className='gap-2'
								onClick={handleDeleteSurvey}
							>
								<MdDeleteForever className='w-4 h-4' /> Delete
							</Button>
						)}
						<CardDescription>
							#Response: {survey.total_responses}
						</CardDescription>
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
			{showDeleteSheet && (
				<DeleteSheet
					setShowDeleteSheet={setShowDeleteSheet}
					deletePollMutation={deleteSurveyMutation}
				/>
			)}
		</Card>
	);
};

export default SurveyCard;
