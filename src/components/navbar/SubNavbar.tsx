import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { FaRedditAlien } from "react-icons/fa";
import { Button } from "../ui/button";

const SubNavbar: React.FC<{
	sub: string;
	setSub: React.Dispatch<React.SetStateAction<string>>;
}> = ({ sub, setSub }) => {
	const { user, login } = useAuth();

	const handleLogin = () => {
		const popup = window.open("http://localhost:3000/login", "Reddit Login");

		window.addEventListener(
			"message",
			event => {
				if (event.origin !== "http://localhost:3000") return;

				if (event.data.type === "AUTH_SUCCESS" && popup != null) {
					console.log(event.data.tokens);
					const { accessToken, refreshToken } = event.data.tokens;
					const {
						Username: username,
						RedditUID: id,
						Avatar: avatar,
					} = event.data.tokens.user;
					login({ accessToken, refreshToken }, { username, id, avatar });
					popup.close();
				}
			},
			false
		);
	};

	return (
		<Card className='w-50% md:w-64 mx-5 lg:mx-0 h-auto md:h-[calc(100vh-4rem)] overflow-x-auto no-scrollbar lg:overflow-y-auto md:sticky top-16 left-0 bg-gray-900/70 backdrop-blur-xl border-gray-700 shadow-lg z-10'>
			<nav className=' flex flex-col h-full justify-between '>
				<div className='flex flex-row justify-evenly md:flex-col md:p-4 p-1 space-x-2 sm:space-x-0 sm:space-y-2'>
					{["kollywood", "tollywood", "MalayalamMovies", "bollywood"].map(
						cat => (
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
						)
					)}
				</div>
				<div className='flex flex-col'>
					<Button
						size='lg'
						variant='default'
						className='hidden md:flex m-5 bg-orange-600 hover:bg-orange-700 text-white items-center'
						onClick={handleLogin}
					>
						<FaRedditAlien size={20} className='mr-2 self-center' />
						<h1>{user ? user.username : "Login"}</h1>
						<h1 className='text-lg font-bold'>Verify</h1>
					</Button>
				</div>
			</nav>
		</Card>
	);
};

export default SubNavbar;
