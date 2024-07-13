// src/components/TierRow.tsx
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import React from "react";
import { DraggableImage } from "./DraggableImage";
import { Image } from "./TierList";

interface TierRowProps {
	tier: string;
	tierColor: string;
	imageIds: string[];
	images: Record<string, Image>;
}

export const TierRow: React.FC<TierRowProps> = ({
	tier,
	imageIds,
	images,
	tierColor,
}) => {
	const { setNodeRef } = useDroppable({
		id: tier,
	});

	return (
		<div className='flex mb-4 items-center'>
			<div className='w-12 h-12 flex items-center justify-center font-bold text-xl'>
				{tier}
			</div>
			<div
				ref={setNodeRef}
				className={`flex-1 bg-opacity-70 rounded-lg flex items-center space-x-2 p-2 min-h-[5rem] ${tierColor}`}
			>
				<SortableContext items={imageIds} strategy={rectSortingStrategy}>
					{imageIds.map(id => (
						<DraggableImage key={id} image={images[id]} />
					))}
				</SortableContext>
			</div>
			<button>X</button>
		</div>
	);
};
