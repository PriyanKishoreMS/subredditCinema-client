// DraggableImage.tsx
import { Image } from "@/components/tiermaker/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface DraggableImageProps {
	image: Image | undefined;
}

export const DraggableImage: React.FC<DraggableImageProps> = ({ image }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: image?.id || "" });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	if (!image) {
		return null; // or return a placeholder image
	}

	return (
		<div>
			<img
				ref={setNodeRef}
				style={style}
				{...listeners}
				{...attributes}
				src={"http://localhost:3000/proxy/" + image.src}
				alt={`Tier ${image.tier} image`}
				className='w-16 h-16 rounded-lg object-cover cursor-move'
			/>
			{/* <p className=''>{image.name}</p> */}
		</div>
	);
};
