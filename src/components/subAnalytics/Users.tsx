import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Skeleton } from "../ui/skeleton";

type UserProps = {
	sub: string;
	type: "top" | "controversial";
	icon: React.ReactNode;
};

const ipAddrPort = "http://localhost:3000";

const fetchUsers = async (sub: string, type: string, interval: string) => {
	try {
		const response = await fetch(
			`${ipAddrPort}/api/reddit/${sub}/${type}/users?interval=${interval}`
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const res = await response.json();
		return res;
	} catch (error) {
		console.error(error, "error here");
		throw error;
	}
};

const UsersSkeleton: React.FC<{
	state: string;
}> = ({ state }) => {
	return (
		<div className='flex items-center space-x-4'>
			<div className='space-y-2'>
				<h1 className='text-md text-gray-500'>{state}</h1>
				<Skeleton className='h-4 w-[200px]' />
				<Skeleton className='h-4 w-[250px]' />
				<Skeleton className='h-4 w-[200px]' />
				<Skeleton className='h-4 w-[250px]' />
			</div>
		</div>
	);
};

const Users: React.FC<UserProps> = ({ sub, type, icon }) => {
	const intervals = ["week", "month", "6months", "year"];
	const [selectedInterval, setSelectedInterval] = React.useState("week");

	const { data, isLoading, isError } = useQuery({
		queryKey: ["users", sub, type, selectedInterval],
		queryFn: () => fetchUsers(sub, type, selectedInterval),
	});

	return (
		<Tabs
			value={selectedInterval}
			onValueChange={setSelectedInterval}
			className='w-full lg:max-w-lg'
		>
			<TabsContent value={selectedInterval}>
				<Card className='bg-gray-900/30 backdrop-blur-md p-5 w-full border-gray-700 shadow-lg'>
					<CardTitle className='text-xl font-bold text-white'>
						<span className='flex items-center gap-2'>
							{icon}
							{type.charAt(0).toUpperCase() + type.slice(1)} Users
						</span>
					</CardTitle>
					<CardDescription className='mb-4'>
						{type.charAt(0).toUpperCase() + type.slice(1)} users of r/{sub}{" "}
						based on the number of posts they have made in the{" "}
						{selectedInterval}
					</CardDescription>
					{isLoading ? (
						<UsersSkeleton state='Loading' />
					) : isError ? (
						<UsersSkeleton state='Error' />
					) : (
						<ul>
							{data.users.map((user: { user: string; post_count: number }) => (
								<li key={user.user} className='text-white font-medium text-lg'>
									<span className='text-orange-500'>u/</span>
									{user.user} - {user.post_count} posts
								</li>
							))}
						</ul>
					)}
				</Card>
			</TabsContent>
			<TabsList className='grid w-full grid-cols-4 mt-2 bg-slate-950/70 bg-opacity-80'>
				{intervals.map(interval => (
					<TabsTrigger
						key={interval}
						className='data-[state=active]:bg-sky-600 hover:bg-slate-800'
						value={interval}
					>
						{interval.charAt(0).toUpperCase() + interval.slice(1)}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
};

export default Users;
