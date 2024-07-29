import { Card } from "@/components/ui/card";

const SubNavbar: React.FC<{
	sub: string;
	setSub: React.Dispatch<React.SetStateAction<string>>;
}> = ({ sub, setSub }) => {
	return (
		<Card className='w-50% md:w-64 mx-5 lg:mx-0 h-auto md:h-[calc(100vh-4rem)] overflow-x-auto no-scrollbar lg:overflow-y-auto md:sticky top-16 left-0 bg-gray-900/30 backdrop-blur-md border-gray-700 shadow-lg z-10'>
			<nav className='flex flex-row justify-evenly md:flex-col md:p-4 p-1 space-x-2 sm:space-x-0 sm:space-y-2'>
				{["kollywood", "tollywood", "MalayalamMovies", "bollywood"].map(cat => (
					<button
						key={cat}
						onClick={() => setSub(cat)}
						className={`lg:p-3 p-1 rounded-full font-medium text-center sm:text-left transition-colors duration-200 whitespace-nowrap ${
							sub === cat
								? "bg-orange-500 text-white"
								: "text-gray-300 hover:bg-gray-700"
						}`}
					>
						r/{cat}
					</button>
				))}
			</nav>
		</Card>
	);
};

export default SubNavbar;
