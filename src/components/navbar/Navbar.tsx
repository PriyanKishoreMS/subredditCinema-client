import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FaRedditAlien } from "react-icons/fa";
import { PiFilmSlateFill } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { CardTitle } from "../ui/card";

const Navbar: React.FC<{
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpen: setLoginSheetOpen }) => {
	const [scrolled, setScrolled] = useState<boolean>(false);
	const [sideSheetOpen, setSideSheetOpen] = useState(false);

	const { user } = useAuth();

	const closeSideSheet = () => setSideSheetOpen(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled ? "bg-gray-900/50 backdrop-blur-xl" : "bg-transparent"
			}`}
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					<Link
						to='/'
						className='flex items-center text-2xl font-bold text-white'
					>
						<PiFilmSlateFill className='mr-2 text-orange-500' />
						<span className='text-orange-500'>SubReddit</span>Cinema
					</Link>
					<div className='hidden md:flex items-center'>
						<NavLink to='/' text='Home' />
						<NavLink to='/tierlist' text='Tierlist' />
						<NavLink to='/polls' text='Polls' />
						<NavLink to='/surveys' text='Surveys' />
					</div>
					<Sheet open={sideSheetOpen} onOpenChange={setSideSheetOpen}>
						<SheetTrigger asChild className='md:hidden'>
							<button className='p-2 text-white hover:text-orange-500 transition-colors'>
								<RxHamburgerMenu className='h-6 w-6' />
							</button>
						</SheetTrigger>

						<SheetContent
							side='right'
							className='w-[300px] bg-gray-900 bg-opacity-50 backdrop-blur-md border-none sm:w-[400px]'
						>
							<nav className='flex flex-col justify-between h-full'>
								<div className='flex flex-col space-y-4 mt-8'>
									<MobileNavItem to='/' text='Home' onClick={closeSideSheet} />
									<MobileNavItem
										to='/tierlist'
										text='Tierlist'
										onClick={closeSideSheet}
									/>
									<MobileNavItem
										to='/polls'
										text='Polls'
										onClick={closeSideSheet}
									/>
									<MobileNavItem
										to='/surveys'
										text='Surveys'
										onClick={closeSideSheet}
									/>
									<MobileNavItem
										to='/memerepo'
										text='Meme Repo'
										onClick={closeSideSheet}
									/>
								</div>
								{user ? (
									<Button
										variant='default'
										className='flex md:hidden m-5 items-center'
										onClick={() => {
											setSideSheetOpen(false);
											setLoginSheetOpen(true);
										}}
									>
										<Avatar>
											<AvatarImage src={user.avatar} alt={user.username} />
											<AvatarFallback>{user.username}</AvatarFallback>
										</Avatar>
										<CardTitle>u/{user.username}</CardTitle>
									</Button>
								) : (
									<Button
										size='lg'
										variant='default'
										className='flex md:hidden m-5 text-white items-center'
										onClick={() => {
											setSideSheetOpen(false);
											setLoginSheetOpen(true);
										}}
									>
										<FaRedditAlien
											size={20}
											className='mr-2 self-center text-orange-500'
										/>
										<h1 className='text-lg font-bold'>Verify</h1>
									</Button>
								)}
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</nav>
	);
};

interface NavItemProps {
	to: string;
	icon?: React.ReactNode;
	text: string;
	onClick?: () => void;
}

const NavLink: React.FC<NavItemProps> = ({ to, text }) => {
	const router = useRouter();
	const isActive = router.state.location.pathname === to;

	return (
		<Link
			to={to}
			className={`flex flex-row items-center ${
				isActive ? "bg-orange-500" : "focus:bg-orange-500 hover:bg-gray-700"
			} px-3 py-1 rounded-full text-white mr-5 transition-colors duration-200`}
			tabIndex={isActive ? 0 : undefined}
			autoFocus={isActive}
		>
			<span className='text-md font-medium'>{text}</span>
		</Link>
	);
};

const MobileNavItem: React.FC<NavItemProps> = ({ to, text, onClick }) => {
	const router = useRouter();
	const isActive = router.state.location.pathname === to;

	return (
		<Link
			to={to}
			className={`flex flex-row items-center ${
				isActive ? "bg-orange-500" : "focus:bg-orange-500"
			} px-3 py-1 rounded-full text-white mr-5 transition-colors duration-200`}
			tabIndex={isActive ? 0 : undefined}
			autoFocus={isActive}
			onClick={onClick}
		>
			<span className='text-md font-medium'>{text}</span>
		</Link>
	);
};

export default Navbar;
