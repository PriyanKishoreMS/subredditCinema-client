import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BASE_URL } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { BiSolidUpvote } from "react-icons/bi";
import { FaComment } from "react-icons/fa";
import { Card, CardDescription, CardTitle } from "../ui/card";

interface Post {
	id: string;
	title: string;
	url: string;
	upvotes: number;
	author: string;
	num_comments: number;
}

interface RedditPostsProps {
	subreddit: string;
	category: "top" | "controversial" | "top_and_controversial" | "hated";
}

const fetchPosts = async (
	subreddit: string,
	interval: string,
	category: string
) => {
	console.log(category, "category");
	const response = await fetch(
		`${BASE_URL}/api/reddit/${subreddit}/${category}/posts?interval=${interval}`
	);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return response.json();
};

const PostsSkeleton: React.FC<{
	state: string;
}> = ({ state }) => {
	return (
		<div className='flex flex-col'>
			<Skeleton className='flex flex-col items-start p-5 lg:w-48 lg:h-64 w-80 h-36 shadow-lg'>
				<h1 className='text-xl text-gray-500'>{state}</h1>
			</Skeleton>
		</div>
	);
};

const RedditPosts: React.FC<RedditPostsProps> = ({ subreddit, category }) => {
	const [selectedInterval, setSelectedInterval] = useState("week");
	const intervals = ["week", "month", "6months", "year"];

	const categoryMap = {
		top: "Top",
		controversial: "Controversial",
		top_and_controversial: "Top and Controversial",
		hated: "Flop",
	};

	const { data, isLoading, isError } = useQuery({
		queryKey: ["posts", subreddit, selectedInterval, category],
		queryFn: () => fetchPosts(subreddit, selectedInterval, category),
	});

	const renderRedditEmbed = (post: Post) => {
		const embedUrl = `https://www.reddit.com${post.url}`;
		return (
			<div key={post.id}>
				<a href={embedUrl} target='_blank' rel='noreferrer'>
					<Card className='cursor-pointer flex flex-col items-start p-5 lg:w-48 lg:h-64 w-80 h-36 bg-gray-900/30 backdrop-blur-md border-gray-700 shadow-lg hover:scale-105 transition-transform duration-200 justify-between'>
						<div>
							<CardTitle className='text-base leading-1'>
								{post.title.length > 70
									? post.title.slice(0, 70) + "..."
									: post.title}
							</CardTitle>
							<CardDescription className='mt-1'>
								u/{post.author}
							</CardDescription>
						</div>
						<div className='flex items-center w-full justify-between'>
							<CardDescription className='flex items-center gap-1'>
								<BiSolidUpvote className='text-orange-500' size={20} />{" "}
								{post.upvotes}
							</CardDescription>
							<CardDescription className=' flex items-center gap-1'>
								<FaComment className='text-cyan-600' size={20} />
								{post.num_comments}
							</CardDescription>
						</div>
					</Card>
				</a>
			</div>
		);
	};

	return (
		<div>
			<Tabs value={selectedInterval} onValueChange={setSelectedInterval}>
				<div className='flex lg:flex-row flex-col justify-between items-center mt-5'>
					<h1 className='text-white text-2xl italic'>
						{categoryMap[category]}
					</h1>
					<TabsList className='grid lg:w-3/4 lg-full grid-cols-4 mt-2 bg-slate-950/70 bg-opacity-80'>
						{intervals.map(interval => (
							<TabsTrigger
								key={interval}
								value={interval}
								className='data-[state=active]:bg-sky-600 hover:bg-slate-800'
							>
								{interval}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				{intervals.map(interval => (
					<TabsContent key={interval} value={interval}>
						{isLoading ? (
							<div className='flex lg:flex-row flex-col items-center justify-center gap-3'>
								{Array.from({ length: 5 }).map((_, index) => (
									<PostsSkeleton key={index} state='Loading' />
								))}
							</div>
						) : isError ? (
							<div className='flex lg:flex-row flex-col items-center justify-center gap-3'>
								{Array.from({ length: 5 }).map((_, index) => (
									<PostsSkeleton key={index} state='Error' />
								))}
							</div>
						) : data.posts.length === 0 ? (
							<div className='flex lg:flex-row flex-col items-center justify-center gap-3'>
								{Array.from({ length: 5 }).map((_, index) => (
									<div key={index} className='flex flex-col'>
										<Skeleton className='flex flex-col items-start p-5 lg:w-48 lg:h-64 w-80 h-36 shadow-lg animate-none'>
											<h1 className='text-xl text-gray-500'>
												{"No " + interval + "ly post found"}
											</h1>
										</Skeleton>
									</div>
								))}
							</div>
						) : (
							<div className='flex items-center justify-center'>
								<div className='flex lg:flex-row flex-col items-center mt-1 justify-center gap-3'>
									{data.posts.map((post: Post) => renderRedditEmbed(post))}
								</div>
							</div>
						)}
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
};

export default RedditPosts;
