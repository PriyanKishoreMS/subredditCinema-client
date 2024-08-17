import { UseMutationResult } from "@tanstack/react-query";
import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardTitle } from "./ui/card";

const DeleteSheet: React.FC<{
	setShowDeleteSheet: React.Dispatch<React.SetStateAction<boolean>>;
	deletePollMutation: UseMutationResult<any, Error, void, unknown>;
}> = ({ setShowDeleteSheet, deletePollMutation }) => {
	return (
		<div className='fixed inset-0 bg-slate-700 backdrop-blur-sm bg-opacity-50 flex justify-center items-center'>
			<Card className='bg-gray-900 p-5 rounded-lg shadow-md border border-slate-700'>
				<CardTitle className='text-lg font-semibold'>
					Are you sure you want to delete this?
				</CardTitle>
				<CardContent className='flex justify-center items-center space-x-3 mt-5'>
					<Button
						variant='destructive'
						onClick={(e: React.MouseEvent) => {
							e.preventDefault();
							e.stopPropagation();
							deletePollMutation.mutate();
							setShowDeleteSheet(false);
						}}
					>
						Delete
					</Button>
					<Button
						variant='secondary'
						onClick={(e: React.MouseEvent) => {
							e.preventDefault();
							e.stopPropagation();
							setShowDeleteSheet(false);
						}}
					>
						Cancel
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default DeleteSheet;
