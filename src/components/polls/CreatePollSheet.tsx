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

const CreatePollSheet: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	openLoginSheet: () => void;
	signedIn: boolean;
}> = ({ isOpen, onClose, openLoginSheet, signedIn }) => {
	const [pollData, setPollData] = useState<PollData>({
		reddit_uid: "",
		subreddit: "",
		title: "",
		description: "",
		options: [
			{ id: 1, text: "" },
			{ id: 2, text: "" },
		],
		end_time: "",
	});
	const [selectedTimeFrame, setSelectedTimeFrame] = useState<string | null>(
		null
	);

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
				end_time: "",
			});
			setSelectedTimeFrame(null);
		},
		onError: () => {
			alert("Failed to create poll");
		},
	});

	const timeFrames = [
		{ label: "12h", hours: 12 },
		{ label: "1 day", hours: 24 },
		{ label: "3 days", hours: 72 },
		{ label: "1 week", hours: 168 },
	];

	const handleTimeFrameSelect = (label: string, hours: number) => {
		const endTime = new Date(Date.now() + hours * 60 * 60 * 1000);
		setPollData(prev => ({ ...prev, end_time: endTime.toISOString() }));
		setSelectedTimeFrame(label);
	};

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
		createPollMutation.mutate(pollData);
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-slate-700 backdrop-blur-xl bg-opacity-50 flex justify-center items-center'>
			<Card className='bg-slate-950/80 backdrop-blur-md p-6 rounded-lg max-w-2xl w-full'>
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
				<div className='space-y-4'>
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
							className=' bg-slate-800 rounded'
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
							className='w-full rounded p-2 bg-slate-800'
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
									className='flex-grow  rounded  p-2 mr-2 bg-slate-800'
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
							className='px-2 py-1 rounded'
							variant='default'
							{...{ disabled: pollData.options.length >= 7 }}
						>
							Add Option
						</Button>
					</div>

					<div className='relative'>
						<label htmlFor='end_time' className='block mb-1 text-white'>
							Deadline
						</label>
						<div className='flex space-x-2'>
							{timeFrames.map(frame => (
								<Button
									type='button'
									key={frame.label}
									variant={
										selectedTimeFrame === frame.label ? "default" : "outline"
									}
									onClick={() =>
										handleTimeFrameSelect(frame.label, frame.hours)
									}
									className={`flex-1`}
								>
									{frame.label}
								</Button>
							))}
						</div>
						<input type='hidden' name='end_time' value={pollData.end_time} />
					</div>

					<div className='text-right'>
						<Button
							type='submit'
							className='bg-blue-500/70 hover:bg-blue-600 text-white px-4 py-2 rounded'
							variant='default'
							onClick={signedIn ? handleSubmit : openLoginSheet}
						>
							{signedIn ? "Create Poll" : "Verify to create poll"}
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default CreatePollSheet;
