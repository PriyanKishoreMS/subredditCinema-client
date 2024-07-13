// src/components/InitRow.tsx
import { useDroppable } from "@dnd-kit/core";
import React from "react";
import { DraggableImage } from "./DraggableImage";
import { Image } from "./TierList";

interface InitRowProps {
	tier: string;
	imageIds: string[];
	images: Record<string, Image>;
}

export const InitRow: React.FC<InitRowProps> = ({ tier, imageIds, images }) => {
	const { setNodeRef } = useDroppable({
		id: tier,
	});

	return (
		<div className='flex items-center mb-4'>
			<div className='w-12 h-12 flex items-center justify-center font-bold text-xl'></div>
			<div
				ref={setNodeRef}
				className='flex-1 border-dashed rounded-lg bg-gray-300 bg-opacity-30 border flex items-center space-x-2 p-2 min-h-[5rem]'
			>
				{imageIds.map(id => (
					<DraggableImage key={id} image={images[id]} />
				))}
			</div>
		</div>
	);
};
