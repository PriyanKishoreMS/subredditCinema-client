import { useAuth } from "@/contexts/AuthContext";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Card, CardDescription, CardTitle } from "../ui/card";

import { Link } from "@tanstack/react-router";
import { FaRedditAlien } from "react-icons/fa";
import { PiFilmSlateFill } from "react-icons/pi";

const Login: React.FC<{
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onClose: () => void;
}> = ({ isOpen, onClose, setIsOpen }) => {
	if (!isOpen) return null;

	const { handleLogin: login } = useAuth();

	return (
		<>
			<div className='fixed inset-0 bg-slate-700 backdrop-blur-xl bg-opacity-50 flex justify-center items-center'>
				<Card className='bg-slate-950/80 w-[36rem] p-5'>
					<div className='flex items-center justify-between'>
						<Button size='icon' className='invisible'></Button>
						<Link
							to='/'
							className='flex items-center text-2xl font-bold text-white'
						>
							<PiFilmSlateFill className='mr-2 text-orange-500' />
							<span className='text-orange-500'>SubReddit</span>Cinema
						</Link>
						<Button size='icon' onClick={onClose} variant='ghost'>
							<Cross1Icon />
						</Button>
					</div>
					<div className='flex flex-col items-center mt-10 justify-center w-full'>
						<CardTitle className='text-2xl font-bold'>
							Verify with your {"  "}
							<span className='bg-orange-600 px-1 italic'>Reddit</span> {"  "}
							Account
						</CardTitle>
						<CardDescription className='text-center mt-1'>
							This action is being done only{" "}
							<span className='font-bold text-white italic'>
								to prevent spam
							</span>
							, we site collects no personal data
						</CardDescription>
					</div>
					<div className='flex justify-center space-x-4 mt-8'>
						<Button
							variant='default'
							className='flex w-52 m-5 bg-orange-600 hover:bg-orange-700 text-white items-center'
							onClick={() => {
								login();
								setIsOpen(false);
							}}
						>
							<FaRedditAlien size={20} className='mr-2 self-center' />
							<h1 className='text-lg font-bold'>Verify</h1>
						</Button>
					</div>
				</Card>
			</div>
		</>
	);
};

export default Login;
