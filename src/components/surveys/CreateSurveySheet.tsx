import { Cross1Icon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

type Option = {
	order: number;
	text: string;
};

type Question = {
	order: number;
	text: string;
	type: string;
	is_required: boolean;
	options: Option[];
};

type SurveyData = {
	subreddit: string;
	title: string;
	description: string;
	questions: Question[];
	end_time: string;
};

const ipAddrPort = "http://localhost:3000";

const subreddits = ["kollywood", "tollywood", "bollywood", "MalayalamMovies"];
const questionTypes = ["text", "single", "multiple"];

const CreateSurveySheet: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
	isOpen,
	onClose,
}) => {
	const [surveyData, setSurveyData] = useState<SurveyData>({
		subreddit: "",
		title: "",
		description: "",
		questions: [],
		end_time: "",
	});

	const queryClient = useQueryClient();

	const createSurveyMutation = useMutation({
		mutationFn: async (data: SurveyData) => {
			const response = await fetch(`${ipAddrPort}/api/survey/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				throw new Error("Failed to create survey");
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["surveys"] });
			alert("Survey created successfully!");
			onClose();
			setSurveyData({
				subreddit: "",
				title: "",
				description: "",
				questions: [],
				end_time: "",
			});
		},
		onError: () => {
			alert("Failed to create survey");
		},
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setSurveyData(prev => ({ ...prev, [name]: value }));
	};

	const addQuestion = () => {
		setSurveyData(prev => ({
			...prev,
			questions: [
				...prev.questions,
				{
					order: prev.questions.length + 1,
					text: "",
					type: "single",
					is_required: false,
					options: [],
				},
			],
		}));
	};

	const updateQuestion = (index: number, field: string, value: any) => {
		setSurveyData(prev => ({
			...prev,
			questions: prev.questions.map((q, i) =>
				i === index ? { ...q, [field]: value } : q
			),
		}));
	};

	const removeQuestion = (questionIndex: number) => {
		setSurveyData(prev => ({
			...prev,
			questions: prev.questions
				.filter((_, i) => i !== questionIndex)
				.map((q, newIndex) => ({ ...q, order: newIndex + 1 })),
		}));
	};

	const addOption = (questionIndex: number) => {
		setSurveyData(prev => ({
			...prev,
			questions: prev.questions.map((q, i) =>
				i === questionIndex
					? {
							...q,
							options: [
								...q.options,
								{
									order: q.options.length + 1,
									text: "",
								},
							],
						}
					: q
			),
		}));
	};

	const updateOption = (
		questionIndex: number,
		optionIndex: number,
		value: string
	) => {
		setSurveyData(prev => ({
			...prev,
			questions: prev.questions.map((q, qI) =>
				qI === questionIndex
					? {
							...q,
							options: q.options.map((o, oI) =>
								oI === optionIndex ? { ...o, text: value } : o
							),
						}
					: q
			),
		}));
	};

	const removeOption = (questionIndex: number, optionIndex: number) => {
		setSurveyData(prev => ({
			...prev,
			questions: prev.questions.map((q, qI) =>
				qI === questionIndex
					? {
							...q,
							options: q.options
								.filter((_, oI) => oI !== optionIndex)
								.map((o, newIndex) => ({ ...o, order: newIndex + 1 })),
						}
					: q
			),
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		surveyData.end_time = new Date(surveyData.end_time).toISOString();
		console.log(surveyData, "surveyData");
		createSurveyMutation.mutate(surveyData);
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-slate-700 bg-opacity-50 flex justify-center items-center'>
			<Card
				className='bg-gray-900/95 border border-gray-700 backdrop-blur-md rounded-lg w-full max-w-4xl m-4 flex flex-col'
				style={{ height: "85vh" }}
			>
				<div className='border-b border-gray-500 flex justify-between items-center'>
					<h2 className='text-2xl font-bold p-6'>Create New Survey</h2>
					<Button
						variant='ghost'
						className='hover:bg-red-600/50 mr-5'
						onClick={onClose}
					>
						<Cross1Icon className='w-4' />
					</Button>
				</div>
				<div className='overflow-y-auto flex-grow p-6'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='bg-gray-800 p-6 rounded-lg shadow-md'>
							<label className='text-lg font-semibold block mb-4'>
								Select Subreddit
							</label>
							<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
								{subreddits.map(sub => (
									<label
										key={sub}
										className='flex items-center space-x-2 cursor-pointer'
									>
										<input
											type='radio'
											name='subreddit'
											value={sub}
											checked={surveyData.subreddit === sub}
											onChange={handleInputChange}
											className='form-radio text-blue-500'
										/>
										<span>{sub}</span>
									</label>
								))}
							</div>
						</div>

						<div className='space-y-2'>
							<label htmlFor='title' className='block mb-1'>
								Title
							</label>
							<Input
								id='title'
								name='title'
								placeholder="What's your survey title?"
								value={surveyData.title}
								onChange={handleInputChange}
								required
								className='w-full border border-gray-500 bg-gray-800 rounded p-2'
							/>
						</div>

						<div className='space-y-2'>
							<label htmlFor='description' className='block mb-1 font-medium'>
								Description
							</label>
							<Textarea
								id='description'
								name='description'
								placeholder="What's your survey about?"
								value={surveyData.description}
								onChange={handleInputChange}
								className='w-full border border-gray-500 bg-gray-800 rounded p-2'
							/>
						</div>

						<div className='space-y-8'>
							<label className='text-lg font-semibold'>Questions</label>
							{surveyData.questions.map((question, qIndex) => (
								<div key={question.order} className='border p-4 mb-4 rounded'>
									{question.order}
									<Input
										value={question.text}
										onChange={e =>
											updateQuestion(qIndex, "text", e.target.value)
										}
										placeholder='Question text'
										required
										className='w-full border border-gray-500 bg-gray-800 rounded p-2 mb-2'
									/>
									<Select
										value={question.type}
										onValueChange={value =>
											updateQuestion(qIndex, "type", value)
										} // className='border rounded p-2 mb-2'
									>
										<SelectTrigger className='w-[180px]'>
											<SelectValue placeholder='Type' />
										</SelectTrigger>
										<SelectContent>
											{questionTypes.map(type => (
												<SelectItem
													className='bg-gray-900'
													key={type}
													value={type}
												>
													{type.replace("_", " ")}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<label className='inline-flex items-center mb-2'>
										<Input
											type='checkbox'
											checked={question.is_required}
											onChange={e =>
												updateQuestion(qIndex, "is_required", e.target.checked)
											}
											className='mr-2'
										/>
										Required
									</label>
									{(question.type === "single" ||
										question.type === "multiple") && (
										<>
											<h4 className='font-bold mb-2'>Options</h4>
											{question.options.map((option, oIndex) => (
												<div key={option.order}>
													<Input
														key={option.order}
														value={option.text}
														onChange={e =>
															updateOption(qIndex, oIndex, e.target.value)
														}
														placeholder={`Option ${oIndex + 1}`}
														required
														className='w-full border rounded p-2 mb-2'
													/>
													<Button>
														<Cross1Icon
															className='w-4 h-4'
															onClick={() => removeOption(qIndex, oIndex)}
														/>
													</Button>
												</div>
											))}
											<Button
												type='button'
												onClick={() => addOption(qIndex)}
												className=' px-2 py-1 rounded'
											>
												Add Option
											</Button>
										</>
									)}
									<Button>
										<Cross1Icon
											className='w-4 h-4'
											onClick={() => removeQuestion(qIndex)}
										/>
									</Button>
								</div>
							))}

							<Button
								variant='default'
								type='button'
								onClick={addQuestion}
								className='mt-4'
							>
								Add Question
							</Button>
						</div>

						<div className='space-y-2'>
							<label htmlFor='end_time' className='block font-medium'>
								End Time
							</label>
							<Input
								id='end_time'
								name='end_time'
								type='datetime-local'
								value={surveyData.end_time}
								onChange={handleInputChange}
								required
								className='w-full border border-gray-500 bg-gray-800 rounded p-2'
							/>
						</div>
					</form>
				</div>
				<div className='border-t border-gray-500 p-6 flex justify-end'>
					<button
						onClick={handleSubmit}
						className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600'
					>
						Create Survey
					</button>
				</div>
			</Card>
		</div>
	);
};

export default CreateSurveySheet;
