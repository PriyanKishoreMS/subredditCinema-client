import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/utils";
import { PlusIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import Login from "../navbar/LoginSheet";
import Logout from "../navbar/LogoutSheet";
import SubNavbar from "../navbar/SubNavbar";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import CreateSurveySheet from "./CreateSurveySheet";
import SurveyCard from "./SurveyCard";
import { SurveysResponse } from "./types";

const SurveySkeleton: React.FC<{ state: string }> = ({ state }) => {
	return (
		<div className='flex flex-col'>
			<Skeleton className='flex flex-col items-start p-5 w-full h-[250px] shadow-lg'>
				<div className='flex justify-start w-full space-x-5 items-center'>
					<Skeleton className='w-11 h-10 rounded-full' />
					<div className='flex flex-col w-full gap-3'>
						<Skeleton className='w-full h-5 rounded-xl' />
						<Skeleton className='w-3/4 h-5 rounded-xl' />
					</div>
				</div>
				<Skeleton className='h-full p-5 mt-5  w-full '>
					<h1 className='text-xl text-gray-500'>{state}</h1>
				</Skeleton>
			</Skeleton>
		</div>
	);
};

const DisplaySurveys = () => {
	const [sub, setSub] = useState("all");
	const [page, setPage] = useState(1);
	const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false);
	const [isLogSheetOpen, setIsLogSheetOpen] = useState(false);
	const { user, setQuestionName } = useAuth();

	const [signedIn, setSignedIn] = useState(user !== null);

	useEffect(() => {
		setSignedIn(user !== null);
	}, [user]);

	const OpenLoginSheet = () => {
		setIsLogSheetOpen(true);
	};

	const { fetchWithoutToken } = useApi();
	const categories = [
		"all",
		"kollywood",
		"tollywood",
		"MalayalamMovies",
		"bollywood",
	];

	const { data, isLoading, isError } = useQuery<SurveysResponse, Error>({
		queryKey: ["surveys", page, sub],
		queryFn: async () => {
			const response = await fetchWithoutToken(
				`/api/survey?page=${page}&sub=${sub}`
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
				<div className={`flex flex-col md:flex-row`}>
					<SubNavbar
						sub={sub}
						cateogoies={categories}
						setSub={setSub}
						setOpen={setIsLogSheetOpen}
					/>
					<div className={`flex-1 p-6 `}>
						<div className='flex flex-col items-center lg:flex-row lg:justify-center mb-5 gap-3'>
							<div className='w-full lg:max-w-3xl'>
								<h1 className='text-3xl text-white font-bold mb-6 text-center'>
									{sub.charAt(0).toUpperCase() + sub.slice(1)} {"  "} Surveys
								</h1>
								<div className='flex flex-col gap-4'>
									{isLoading &&
										Array.from({ length: 5 }).map((_, i) => (
											<SurveySkeleton key={i} state='Loading...' />
										))}{" "}
									{isError && <SurveySkeleton state={"Error..."} />}
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
					signedIn={signedIn}
					openLoginSheet={OpenLoginSheet}
				/>
			</div>
			{user ? (
				<Logout
					setIsOpen={setIsLogSheetOpen}
					isOpen={isLogSheetOpen}
					onClose={() => setIsLogSheetOpen(false)}
				/>
			) : (
				<Login
					setIsOpen={setIsLogSheetOpen}
					isOpen={isLogSheetOpen}
					onClose={() => setIsLogSheetOpen(false)}
				/>
			)}
		</>
	);
};

export default DisplaySurveys;
