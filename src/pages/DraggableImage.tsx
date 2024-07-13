// src/components/DraggableImage.tsx
import { useDraggable } from "@dnd-kit/core";
import React from "react";
import { Image } from "./TierList";

interface DraggableImageProps {
	image: Image;
}

export const DraggableImage: React.FC<DraggableImageProps> = ({ image }) => {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: image.id,
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
		  }
		: undefined;

	return (
		<img
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			src={image.src}
			alt={`Tier ${image.tier} image`}
			className='w-16 h-16 rounded-lg object-cover cursor-move'
		/>
	);
};
