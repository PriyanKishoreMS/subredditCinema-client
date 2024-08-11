import { QuestionPieChart } from "@/components/surveys/QuestionPieChart";
import { SurveyResponse } from "@/components/surveys/types";
import { useApi } from "@/utils";
import { useQuery } from "@tanstack/react-query";

const SurveyResults: React.FC<{
	surveyID: number;
	question: SurveyResponse["questions"][0];
}> = ({ surveyID, question }) => {
	const { fetchWithoutToken } = useApi();

	const fetchSurveyResults = async (surveyId: number) => {
		const response = await fetchWithoutToken(`/api/survey/results/${surveyId}`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return response.json();
	};

	const useSurveyResults = (surveyId: number) => {
		return useQuery({
			queryKey: ["surveyResults", surveyId],
			queryFn: async () => await fetchSurveyResults(surveyId),
		});
	};

	const {
		data: surveyResults,
		isLoading,
		isError,
	} = useSurveyResults(Number(surveyID));

	return (
		<>
			{surveyResults && surveyResults.results[question.question_id] && (
				<QuestionPieChart
					data={surveyResults.results[question.question_id].result_count.map(
						(result: { option_id: number; count: number }) => ({
							...result,
							text:
								question?.options?.find(o => o.option_id === result.option_id)
									?.text || "",
						})
					)}
					questionText={question.text}
					responseCount={
						surveyResults.results[question.question_id].response_count
					}
				/>
			)}
		</>
	);
};

export default SurveyResults;
