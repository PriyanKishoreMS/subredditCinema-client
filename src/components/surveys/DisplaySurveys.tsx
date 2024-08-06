import { useApi } from "@/utils";
import { PlusIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import SubNavbar from "../navbar/SubNavbar";
import { Button } from "../ui/button";
import CreateSurveySheet from "./CreateSurveySheet";
import SurveyCard from "./SurveyCard";
import { SurveysResponse } from "./types";

const DisplaySurveys = () => {
	const [sub, setSub] = useState("all");
	const [page, setPage] = useState(1);
	const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false);
	const { fetchWithoutToken } = useApi();

	const { data, isLoading, isError, error } = useQuery<SurveysResponse, Error>({
		queryKey: ["surveys", page, sub],
		queryFn: async () => {
			const response = await fetchWithoutToken(
				`/api/survey/all?page=${page}&sub=${sub}`
			);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		},
	});

	const surveys = data?.surveys || [];
	const metadata = data?.metadata;

	return (
		<>
			<div className='min-h-screen'>
				<div
					className={`flex flex-col md:flex-row ${isCreateSurveyOpen && "blur-xl ease-in-out duration-100"}`}
				>
					<SubNavbar sub={sub} setSub={setSub} />
					<div className={`flex-1 p-6 `}>
						<div className='flex flex-col items-center lg:flex-row lg:justify-center mb-5 gap-3'>
							<div className='w-full lg:max-w-3xl'>
								<h1 className='text-3xl text-white font-bold mb-6 text-center'>
									{sub.charAt(0).toUpperCase() + sub.slice(1)}
									Survey
								</h1>
								<div className='flex flex-col gap-4'>
									{surveys.map(survey => (
										<Link
											key={survey.id}
											to={`/surveys/${survey.id}`}
											params={{ surveyId: survey.id.toString() }}
										>
											<SurveyCard key={survey.id} survey={survey} />
										</Link>
									))}
								</div>
								<div className='flex justify-center mt-6 space-x-2'>
									<Button
										onClick={() => setPage(p => Math.max(1, p - 1))}
										disabled={page === 1}
										variant='outline'
										className='text-white'
									>
										<FaChevronLeft className='h-4 w-4 mr-2' /> Previous
									</Button>
									<Button
										onClick={() => setPage(p => p + 1)}
										disabled={page === metadata?.last_page}
										variant='outline'
										className='text-white'
									>
										Next <FaChevronRight className='h-4 w-4 ml-2' />
									</Button>
								</div>
							</div>
						</div>
						<div className='fixed md:bottom-12 md:right-12 bottom-2 right-2'>
							<Button
								size='lg'
								variant='secondary'
								className='hidden md:flex bg-blue-500 hover:bg-blue-600 font-bold py-4 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 items-center'
								onClick={() => setIsCreateSurveyOpen(true)}
							>
								<PlusIcon className='h-5 w-5 mr-2' />
								<h1 className='text-md'>Create new Survey</h1>
							</Button>
							<Button
								size='default'
								variant='secondary'
								className='md:hidden bg-blue-500 hover:bg-blue-600 font-bold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105'
								onClick={() => setIsCreateSurveyOpen(true)}
							>
								<PlusIcon className='h-4 w-4 mr-2' />
								Add
							</Button>
						</div>
					</div>
				</div>

				<CreateSurveySheet
					isOpen={isCreateSurveyOpen}
					onClose={() => setIsCreateSurveyOpen(false)}
				/>
			</div>
		</>
	);
};

export default DisplaySurveys;