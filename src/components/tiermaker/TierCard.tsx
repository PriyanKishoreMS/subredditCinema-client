import DeleteSheet from "@/components/DeleteSheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { formatPastTime, useApi } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import Image from "../Image";
import { Tierlists } from "./types";

interface TierListCardProps {
	tierlist: Tierlists;
}

const TierCard: React.FC<TierListCardProps> = ({ tierlist }) => {
	const { value: createdTimeValue, unit: createdTimeUnit } = formatPastTime(
		tierlist.created_at
	);
	const { user } = useAuth();
	const [showDeleteSheet, setShowDeleteSheet] = useState(false);
	const { fetchWithToken } = useApi();
	const queryClient = useQueryClient();

	const deleteTierlistMutation = useMutation({
		mutationFn: async () => {
			const response = await fetchWithToken(
				`/api/tierlist/delete/${tierlist.id}`,
				{
					method: "DELETE",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to delete tierlist");
			}
			const res = response.json();
			return res;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tierlists"] });
			alert("tierlist deleted successfully");
		},
		onError: error => {
			console.error(error);
			alert("Failed to delete tierlist");
		},
	});

	const handleDeleteTierList = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setShowDeleteSheet(true);
	};

	const fallbackAvatar = "./fallbacksnoovatar.png";

	return (
		<Card className='group hover:shadow-lg transition-all duration-100 bg-gray-900/75 backdrop-blur-md border-gray-700 overflow-hidden cursor-pointer hover:bg-gray-900/50'>
			<CardHeader className='relative'>
				<div className='flex justify-between items-center'>
					<div className='flex items-center space-x-4'>
						<Avatar>
							<AvatarImage
								src={tierlist.avatar || fallbackAvatar}
								alt={tierlist.username}
							/>
							<AvatarFallback>{tierlist.username}</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle className='text-white'>
								u/{tierlist.username}
							</CardTitle>
							<Badge
								variant='secondary'
								className='bg-gray-800 text-gray-300 group-hover:bg-orange-600 group-hover:text-white mt-2'
							>
								r/{tierlist.subreddit}
							</Badge>
						</div>
					</div>
					{user?.id && user.id === tierlist.reddit_uid && (
						<Button
							type='button'
							variant='destructive'
							size='sm'
							className='gap-2'
							onClick={handleDeleteTierList}
						>
							<MdDeleteForever className='w-4 h-4' /> Delete
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent className='space-y-5'>
				<CardTitle className='text-2xl'>{tierlist.title}</CardTitle>
				<div className='flex items-center justify-center'>
					<Image
						src={tierlist.image_url}
						className='h-64 w-full object-cover rounded-lg'
						alt={tierlist.title}
					/>
				</div>
				<div className='flex justify-between items-center text-sm text-gray-400'>
					<div className='flex items-center'>
						{/* <CalendarIcon className='w-4 h-4 mr-1 text-green-500' /> */}
						{createdTimeValue}
						{createdTimeUnit} ago
					</div>
					{/* {survey.total_responses} */}
				</div>
			</CardContent>
			{showDeleteSheet && (
				<DeleteSheet
					setShowDeleteSheet={setShowDeleteSheet}
					deletePollMutation={deleteTierlistMutation}
				/>
			)}
		</Card>
	);
};

export default TierCard;
