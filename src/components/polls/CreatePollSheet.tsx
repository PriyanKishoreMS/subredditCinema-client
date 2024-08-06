import { Cross1Icon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type PollOption = {
	id: number;
	text: string;
	img_url?: string;
};

type PollData = {
	reddit_uid: string;
	subreddit: string;
	title: string;
	description: string;
	options: PollOption[];
	voting_method: string;
	end_time: string;
};

const ipAddrPort = "http://localhost:3000";

const subreddits = ["kollywood", "tollywood", "bollywood", "MalayalamMovies"];

const PostNewPoll = async (data: PollData) => {
	const response = await fetch(`${ipAddrPort}/api/poll/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new Error("Failed to create poll");
	}
	return response.json();
};

const CreatePollSheet: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
	isOpen,
	onClose,
}) => {
	const [pollData, setPollData] = useState<PollData>({
		reddit_uid: "",
		subreddit: "",
		title: "",
		description: "",
		options: [
			{ id: 1, text: "" },
			{ id: 2, text: "" },
		],
		voting_method: "single",
		end_time: "",
	});

	const queryClient = useQueryClient();

	const createPollMutation = useMutation({
		mutationFn: async (data: PollData) => PostNewPoll(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["polls"] });
			console.log("Poll created successfully");
			onClose();
			setPollData({
				reddit_uid: "",
				subreddit: "",
				title: "",
				description: "",
				options: [
					{ id: 1, text: "" },
					{ id: 2, text: "" },
				],
				voting_method: "single",
				end_time: "",
			});
		},
		onError: () => {
			alert("Failed to create poll");
		},
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setPollData(prev => ({ ...prev, [name]: value }));
	};

	const handleOptionChange = (index: number, value: string) => {
		setPollData(prev => ({
			...prev,
			options: prev.options.map((opt, i) =>
				i === index ? { ...opt, text: value } : opt
			),
		}));
	};

	const addOption = () => {
		setPollData(prev => ({
			...prev,
			options: [...prev.options, { id: prev.options.length + 1, text: "" }],
		}));
	};

	const removeOption = (index: number) => {
		setPollData(prev => ({
			...prev,
			options: prev.options.filter((_, i) => i !== index),
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		pollData.end_time = new Date(pollData.end_time).toISOString();
		createPollMutation.mutate(pollData);
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-slate-700 bg-opacity-50 flex justify-center items-center'>
			<Card className='bg-gray-900/95 border border-gray-700 backdrop-blur-md p-6 rounded-lg max-w-2xl w-full'>
				<div className='flex justify-between items-center'>
					<h2 className='text-2xl font-bold my-4 self-center'>
						Create New Poll
					</h2>
					<Button
						type='button'
						size='icon'
						variant='ghost'
						className='hover:bg-red-600/50'
						onClick={onClose}
					>
						<Cross1Icon className='w-4 h-4' />
					</Button>
				</div>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<label className='block mb-1'>Select Subreddit</label>
					<div className='flex flex-col items-strech'>
						<div className='grid grid-cols-2 lg:grid-cols-4'>
							{subreddits.map(sub => (
								<label key={sub} className='flex items-center'>
									<input
										type='radio'
										name='subreddit'
										value={sub}
										checked={pollData.subreddit === sub}
										onChange={handleInputChange}
										className='mr-2'
										required
									/>
									{sub}
								</label>
							))}
						</div>
					</div>

					<div>
						<label htmlFor='title' className='block mb-1'>
							Title
						</label>
						<Input
							id='title'
							type='text'
							placeholder="What's your question?"
							name='title'
							value={pollData.title}
							onChange={handleInputChange}
							required
							className='border border-gray-500 bg-gray-800 rounded'
						/>
					</div>

					<div>
						<label htmlFor='description' className='block mb-1'>
							Description
						</label>
						<Textarea
							id='description'
							name='description'
							value={pollData.description}
							onChange={handleInputChange}
							className='w-full border border-gray-500 rounded p-2 bg-gray-800'
							placeholder='Add a description'
						/>
					</div>

					<div>
						<label className='block mb-1'>Options</label>
						{pollData.options.map((option, index) => (
							<div key={index} className='flex mb-2'>
								<Input
									value={option.text}
									onChange={e => handleOptionChange(index, e.target.value)}
									placeholder={`Option ${index + 1}`}
									required
									className='flex-grow border rounded border-gray-500 p-2 mr-2 bg-gray-800'
								/>
								<Button
									type='button'
									size='icon'
									onClick={() => removeOption(index)}
									className='bg-red-500/50 hover:bg-red-500 text-white px-2 py-1 rounded'
									variant='ghost'
								>
									<Cross1Icon className='w-4' />
								</Button>
							</div>
						))}
						<Button
							type='button'
							onClick={addOption}
							className='bg-blue-500/50 hover:bg-blue-500 text-white px-2 py-1 rounded'
							variant='ghost'
							{...{ disabled: pollData.options.length >= 7 }}
						>
							Add Option
						</Button>
					</div>

					<div className='relative'>
						<label htmlFor='end_time' className='block mb-1 text-white'>
							End Time
						</label>
						<input
							id='end_time'
							name='end_time'
							type='datetime-local'
							value={pollData.end_time}
							onChange={handleInputChange}
							required
							className='w-full border rounded p-2 bg-gray-800 text-white border-gray-600'
							style={{
								colorScheme: "dark",
							}}
						/>
					</div>

					<div className='text-right'>
						<Button
							type='submit'
							className='bg-green-500/50 hover:bg-green-500 text-white px-4 py-2 rounded'
							variant='ghost'
						>
							Create Poll
						</Button>
					</div>
				</form>
			</Card>
		</div>
	);
};

export default CreatePollSheet;
