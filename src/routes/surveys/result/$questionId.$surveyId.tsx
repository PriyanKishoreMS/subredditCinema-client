import { TextResponses } from "@/components/surveys/types";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { formatPastTime, useApi } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";

export const Route = createFileRoute("/surveys/result/$questionId/$surveyId")({
	component: TextResponse,
});

function TextResponse() {
	const { questionId, surveyId } = Route.useParams();
	const { questionName } = useAuth();
	const [questionText, _] = useState(questionName);

	const {
		data: textResponses,
		isLoading: isLoadingResponses,
		isError: isErrorResponses,
	} = useQuery<TextResponses, Error>({
		queryKey: ["survey", questionId],
		queryFn: () => fetchSurveyInfo(parseInt(questionId)),
	});

	const { fetchWithToken } = useApi();

	const fetchSurveyInfo = async (questionId: number) => {
		try {
			const response = await fetchWithToken(
				`/api/survey/results/question/${questionId}`
			);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		} catch (err) {
			console.error(err);
		}
	};

	if (isErrorResponses) {
		return <Card>Error loading responses</Card>;
	}

	const backlink = `/surveys/${surveyId}`;

	return (
		<>
			<Card className='md:max-w-5xl mx-auto bg-gray-950/70 backdrop-blur-md border-gray-700 p-6'>
				<div className='flex flex-col items-start justify-center w-full'>
					<Button size='icon' variant='outline' className='p-5 rounded-xl'>
						<Link to={backlink}>
							<IoIosArrowRoundBack className='w-8 h-8 text-sky-500' />
						</Link>
					</Button>
					<CardHeader className='flex self-center items-center w-full'>
						<CardTitle className='font-bold text-2xl'>{questionText}</CardTitle>
					</CardHeader>
					{textResponses?.responses &&
						textResponses.responses.map(response => {
							const { value: createdTimeValue, unit: createdTimeUnit } =
								formatPastTime(response.created_at);
							return (
								<CardContent
									className='flex flex-row items-center gap-3 w-full text-lg p-2'
									key={response.answer_id}
								>
									<CardDescription>
										{createdTimeValue}
										{createdTimeUnit}
									</CardDescription>
									<CardTitle className='font-normal'>
										{response.answer_text}
									</CardTitle>
								</CardContent>
							);
						})}
				</div>
			</Card>
		</>
	);
}
