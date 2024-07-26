// Navbar.tsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar: React.FC = () => {
	const [scrolled, setScrolled] = useState<boolean>(false);

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
				scrolled ? "bg-gray-900/50 backdrop-blur-md" : "bg-transparent"
			}`}
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					<Link
						to='/'
						className='flex items-center text-2xl font-bold text-white'
					>
						<FaReddit className='mr-2 text-orange-500' />
						<span className='text-orange-500'>SubReddit</span>Sinema
					</Link>
					<div className='hidden md:flex items-center'>
						<NavLink to='/' text='Home' />
						<NavLink to='/tiermaker' text='Tiermaker' />
						<NavLink to='/polls' text='Polls' />
						<NavLink to='/surveys' text='Surveys' />
						<NavLink to='/memerepo' text='Meme Repo' />
					</div>
					<Sheet>
						<SheetTrigger asChild className='md:hidden'>
							<button className='p-2 text-white hover:text-orange-500 transition-colors'>
								<RxHamburgerMenu className='h-6 w-6' />
							</button>
						</SheetTrigger>
						<SheetContent
							side='right'
							className='w-[300px] bg-gray-900 bg-opacity-50 backdrop-blur-md border-none sm:w-[400px]'
						>
							<nav className='flex flex-col space-y-4 mt-8'>
								<MobileNavItem to='/' text='Home' />
								<MobileNavItem to='/tiermaker' text='Tiermaker' />
								<MobileNavItem to='/polls' text='Polls' />
								<MobileNavItem to='/surveys' text='Surveys' />
								<MobileNavItem to='/memerepo' text='Meme Repo' />
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
}

const NavLink: React.FC<NavItemProps> = ({ to, text }) => {
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
		>
			<span className='text-md font-medium'>{text}</span>
		</Link>
	);
};

const MobileNavItem: React.FC<NavItemProps> = ({ to, text }) => {
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
		>
			<span className='text-md font-medium'>{text}</span>
		</Link>
	);
};

export default Navbar;
