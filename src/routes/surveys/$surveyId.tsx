import Login from "@/components/navbar/LoginSheet";
import SurveyResults from "@/components/surveys/SurveyResults";
import { Answer, SurveyResponse } from "@/components/surveys/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack, IoMdShare } from "react-icons/io";

export const Route = createFileRoute("/surveys/$surveyId")({
	component: SurveyPage,
});

function SurveyPage() {
	const { surveyId } = Route.useParams();
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [requiredNotAnswered, setRequiredNotAnswered] = useState(false);
	const { user } = useAuth();
	const [signedIn, setSignedIn] = useState(user !== null);
	const [isLogSheetOpen, setIsLogSheetOpen] = useState(false);
	const currentTime = new Date().toISOString();

	useEffect(() => {
		setSignedIn(user !== null);
	}, [user]);

	const {
		data: survey,
		isLoading: isLoadingQuestions,
		isError: isErrorQuestions,
	} = useQuery<SurveyResponse, Error>({
		queryKey: ["survey", surveyId],
		queryFn: () => fetchSurveyInfo(parseInt(surveyId)),
	});

	const [showResults, setShowResults] = useState(survey?.is_responded);

	const queryClient = useQueryClient();
	const { fetchWithToken } = useApi();

	const fetchSurveyInfo = async (surveyId: number) => {
		try {
			const response = await fetchWithToken(`/api/survey/${surveyId}`);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		} catch (err) {
			console.error(err);
		}
	};

	const submitMutation = useMutation({
		mutationFn: async (data: Answer[]) => {
			const response = await fetchWithToken(
				`/api/survey/response/${surveyId}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				}
			);
			if (!response.ok) {
				throw new Error("Failed to submit survey");
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["survey", surveyId] });
			alert("Survey submitted successfully!");
		},
	});

	if (isLoadingQuestions) return <div>Loading...</div>;
	if (isErrorQuestions) return <div>Error loading survey</div>;
	if (!survey) return null;

	const handleAnswerChange = (
		questionId: number,
		value: string | number | number[]
	) => {
		const question = survey.questions.find(q => q.question_id === questionId);
		if (!question) return;

		setAnswers(prev => {
			const otherAnswers = prev.filter(a => a.question_id !== questionId);

			let newAnswers: Answer[];
			switch (question.type) {
				case "text":
					newAnswers = [
						{ question_id: questionId, answer_text: value as string },
					];
					break;
				case "single":
					newAnswers = [
						{ question_id: questionId, selected_option_id: value as number },
					];
					break;
				case "multiple":
					newAnswers = (value as number[]).map(optionId => ({
						question_id: questionId,
						selected_option_id: optionId,
					}));
					break;
				default:
					newAnswers = [];
			}

			return [...otherAnswers, ...newAnswers];
		});
	};

	const handleShare = () => {
		navigator.clipboard.writeText(window.location.href);
		alert("Link copied to clipboard!");
	};

	const handleSubmit = () => {
		const requiredQuestions = survey.questions.filter(q => q.is_required);
		const requiredAnswered = requiredQuestions.every(q =>
			answers.some(a => a.question_id === q.question_id)
		);
		if (!requiredAnswered) {
			setRequiredNotAnswered(true);
			return;
		}

		console.log(answers, "answers");
		submitMutation.mutate(answers);
	};

	return (
		<>
			<Card className='md:max-w-5xl mx-auto bg-gray-950/70 backdrop-blur-md border-gray-700 p-6'>
				<div className='flex items-center justify-between w-full'>
					<Button size='icon' variant='outline' className='p-5 rounded-xl'>
						<Link to='/surveys'>
							<IoIosArrowRoundBack className='w-8 h-8 text-sky-500' />
						</Link>
					</Button>
					<div className='items-center justify-center flex gap-3'>
						<Button
							variant='secondary'
							disabled={
								!signedIn ||
								(currentTime < survey?.end_time && !survey?.is_responded)
							}
							onClick={() => setShowResults(!showResults)}
						>
							{signedIn ? (
								<>
									{survey?.is_responded ? (
										<>{showResults ? "Hide Results" : "Show Results"} </>
									) : currentTime > survey?.end_time ? (
										"Show Results"
									) : (
										"Participate to see results"
									)}
								</>
							) : (
								"Participate to see results"
							)}
						</Button>

						<Button
							size='icon'
							variant='outline'
							className='p-5 rounded-xl'
							onClick={handleShare}
						>
							<p>
								<IoMdShare className='w-6 h-6 text-sky-500' />
							</p>
						</Button>
					</div>
				</div>
				<CardHeader className='mb-8'>
					<div className='flex items-start justify-between '>
						<div className='flex flex-col justify-center w-full items-center'>
							<CardTitle className='text-2xl font-bold text-center'>
								{survey.title}
							</CardTitle>
							<CardDescription
								className={` mt-2 w-full text-justify ${survey.description?.length > 30 ? "text-justify" : "text-center"}`}
							>
								{survey.description}
							</CardDescription>
						</div>
					</div>
					<CardDescription className='flex self-end'>
						<Badge variant='secondary' className='bg-blue-600/40'>
							{survey.is_responded ? "already responded" : "new"}
						</Badge>
					</CardDescription>
				</CardHeader>

				<CardContent>
					{survey.questions.map(question => (
						<div key={question.question_id} className='mb-8 flex flex-wrap'>
							<div className='w-full'>
								<p className='font-semibold mb-4'>
									{question.text}
									{question.is_required && (
										<span className='text-red-500'>*</span>
									)}
									{requiredNotAnswered && question.is_required && (
										<p className='text-red-500 text-sm'>
											This question is required
										</p>
									)}
								</p>
								{showResults ? (
									<SurveyResults surveyID={survey.id} question={question} />
								) : (
									<>
										{question.type === "text" && (
											<Input
												placeholder='Type your answer here'
												className='w-full border border-gray-500 bg-gray-800 rounded p-2'
												type='text'
												onChange={e =>
													handleAnswerChange(
														question.question_id,
														e.target.value
													)
												}
												required={question.is_required}
											/>
										)}

										{question.type === "single" && question.options && (
											<RadioGroup
												onValueChange={value =>
													handleAnswerChange(
														question.question_id,
														parseInt(value)
													)
												}
											>
												{question.options.map(option => (
													<div
														key={option.option_id}
														className='flex items-center space-x-4'
													>
														<RadioGroupItem
															value={option.option_id.toString()}
															id={`${option.option_id}`}
														/>
														<Label
															htmlFor={`${option.option_id}`}
															className='hover:text-slate-400 cursor-pointer'
														>
															{option.text}
														</Label>
													</div>
												))}
											</RadioGroup>
										)}
										{question.type === "multiple" && question.options && (
											<div className='space-y-4'>
												{question.options.map(option => (
													<div
														key={option.option_id}
														className='flex items-center space-x-4'
													>
														<Checkbox
															id={`${option.option_id}`}
															onCheckedChange={checked => {
																const currentAnswers = answers.filter(
																	a => a.question_id === question.question_id
																);
																const currentIds = currentAnswers.map(
																	a => a.selected_option_id!
																);
																let newIds: number[];
																if (checked) {
																	newIds = [...currentIds, option.option_id];
																} else {
																	newIds = currentIds.filter(
																		id => id !== option.option_id
																	);
																}
																handleAnswerChange(
																	question.question_id,
																	newIds
																);
															}}
															checked={answers.some(
																a =>
																	a.question_id === question.question_id &&
																	a.selected_option_id === option.option_id
															)}
														/>
														<Label
															htmlFor={`${option.option_id}`}
															className='hover:text-slate-400 cursor-pointer'
														>
															{option.text}
														</Label>
													</div>
												))}
											</div>
										)}
									</>
								)}
							</div>
						</div>
					))}

					{!showResults && (
						<Button
							onClick={signedIn ? handleSubmit : () => setIsLogSheetOpen(true)}
							disabled={
								submitMutation.isPending ||
								survey?.is_responded ||
								currentTime > survey.end_time
							}
						>
							{!signedIn ? (
								"Verify to participate in the survey"
							) : (
								<>
									{submitMutation.isPending ? (
										"Submitting..."
									) : (
										<>
											{survey?.is_responded
												? "Already submitted"
												: currentTime > survey?.end_time
													? "Survey Over"
													: "Submit Survey"}
										</>
									)}
								</>
							)}
						</Button>
					)}
				</CardContent>
			</Card>
			<Login
				setIsOpen={setIsLogSheetOpen}
				isOpen={isLogSheetOpen}
				onClose={() => setIsLogSheetOpen(false)}
			/>
		</>
	);
}
