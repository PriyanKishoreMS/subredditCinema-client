import { useAuth } from "@/contexts/AuthContext";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const Logout: React.FC<{
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onClose: () => void;
}> = ({ isOpen, onClose, setIsOpen }) => {
	if (!isOpen) return null;

	const { logout } = useAuth();
	return (
		<>
			<div className='fixed inset-0 bg-slate-700 bg-opacity-50 flex justify-center items-center'>
				<Card className='w-96'>
					<h1 className='text-xl text-center font-bold'>
						Click the button below to logout
					</h1>
					<Button onClick={onClose} variant='secondary'>
						Close
					</Button>
					<div className='flex justify-center space-x-4 mt-4'>
						<Button
							onClick={() => {
								logout();
								setIsOpen(false);
							}}
							variant='destructive'
						>
							Logout
						</Button>
					</div>
				</Card>
			</div>
		</>
	);
};

export default Logout;
