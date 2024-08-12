import { useAuth } from "@/contexts/AuthContext";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const Logout: React.FC<{
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onClose: () => void;
}> = ({ isOpen, onClose, setIsOpen }) => {
	if (!isOpen) return null;

	const { logout, user } = useAuth();
	return (
		<>
			<div className='fixed inset-0 bg-slate-700 backdrop-blur-xl bg-opacity-50 flex justify-center items-center'>
				<Card className='bg-slate-950/80 w-96 h-96 p-5'>
					<div className='flex items-center justify-end'>
						<Button size='icon' onClick={onClose} variant='ghost'>
							<Cross1Icon />
						</Button>
					</div>
					<div className='flex items-center justify-center w-full'>
						<h1 className='text-xl text-center font-bold'>
							You will be logged out from u/{user?.username}
						</h1>
					</div>
					<div className='flex flex-col items-center justify-center h-2/3'>
						<Avatar className='w-20 h-24'>
							<AvatarImage src={user?.avatar} alt={user?.username} />
							<AvatarFallback>{user?.username}</AvatarFallback>
						</Avatar>
						<div className='flex justify-center space-x-4  mt-5'>
							<Button
								onClick={() => {
									logout();
									setIsOpen(false);
								}}
								variant='destructive'
								className='w-52 mt-5'
							>
								Logout
							</Button>
						</div>
					</div>
				</Card>
			</div>
		</>
	);
};

export default Logout;
