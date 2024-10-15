import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import React from "react";
import { DraggableImage } from "./DraggableImage";
import { Image } from "./types";

interface InitRowProps {
	tier: string;
	imageIds: string[];
	images: Record<string, Image>;
	handleRemoveImage: (id: string) => void;
}

export const InitRow: React.FC<InitRowProps> = ({
	tier,
	imageIds,
	images,
	handleRemoveImage,
}) => {
	const { setNodeRef } = useDroppable({
		id: tier,
	});

	return (
		<div className='flex items-center w-full mt-8'>
			<div
				ref={setNodeRef}
				className='flex-grow  grid grid-cols-5 md:grid-cols-11 gap-4 border-2 border-dashed border-gray-500 rounded-lg bg-gray-800 p-4 min-h-[6rem] transition-all duration-300 hover:bg-opacity-90 bg-opacity-50 backdrop-blur-md'
			>
				<SortableContext items={imageIds} strategy={rectSortingStrategy}>
					{imageIds.length > 0 ? (
						imageIds.map(id => (
							<DraggableImage
								tier={tier}
								key={id}
								image={images[id]}
								handleRemoveImage={handleRemoveImage}
							/>
						))
					) : (
						<div className='col-span-6 md:col-span-11 flex items-center justify-center text-gray-500 italic'>
							Search and click on items here to start
						</div>
					)}
				</SortableContext>
			</div>
		</div>
	);
};
