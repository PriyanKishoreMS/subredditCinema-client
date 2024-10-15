// DraggableImage.tsx
import { Image } from "@/components/tiermaker/types";
import { BASE_URL } from "@/utils/api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { IoIosCloseCircle } from "react-icons/io";

interface DraggableImageProps {
	image: Image | undefined;
	tier?: string;
	handleRemoveImage: (id: string) => void;
}

export const DraggableImage: React.FC<DraggableImageProps> = ({
	image,
	tier,
	handleRemoveImage,
}) => {
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
		return null;
	}

	return (
		<div className='relative'>
			<img
				ref={setNodeRef}
				style={style}
				{...listeners}
				{...attributes}
				src={`${BASE_URL}/proxy/` + image.src}
				alt={`Tier ${image.tier} image`}
				className='w-16 h-16 rounded-sm object-cover cursor-move'
			/>
			{tier == "start" && (
				<button
					onClick={() => handleRemoveImage(image.id)}
					className='absolute top-0 right-0 p-0'
				>
					<span className='block w-5 h-5 bg-black rounded-full bg-opacity-80'>
						<IoIosCloseCircle className='w-5 h-5 text-white' />
					</span>
				</button>
			)}
			{/* <p className=''>{image.name}</p> */}
		</div>
	);
};
