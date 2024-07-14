import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import React, { useState } from "react";
import { DraggableImage } from "./DraggableImage";
import { Image } from "./TierList";

interface TierRowProps {
	tier: string;
	changeTierColor: (color: string) => void;
	tierColor: string;
	imageIds: string[];
	images: Record<string, Image>;
	onTierNameChange: (newName: string) => void;
	onRemoveTier: () => void;
}

const colors = [
	"bg-green-600",
	"bg-yellow-300",
	"bg-yellow-500",
	"bg-blue-400",
	"bg-red-600",
	"bg-purple-600",
	"bg-pink-600",
	"bg-indigo-600",
	"bg-gray-600",
];

export const TierRow: React.FC<TierRowProps> = ({
	tier,
	imageIds,
	images,
	tierColor,
	onTierNameChange,
	changeTierColor,
	onRemoveTier,
}) => {
	const { setNodeRef } = useDroppable({
		id: tier,
	});

	const [showColorPicker, setShowColorPicker] = useState(false);

	const handleColorChange = (color: string) => {
		changeTierColor(color);
		setShowColorPicker(false);
	};

	return (
		<div className='flex mb-4 items-center'>
			<input
				type='text'
				value={tier}
				onChange={e => onTierNameChange(e.target.value)}
				className='w-12 h-12 flex items-center justify-center font-bold text-xl bg-transparent border-none'
			/>
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
			<button onClick={onRemoveTier} className='ml-2'>
				X
			</button>
			<div className='relative'>
				<button onClick={() => setShowColorPicker(!showColorPicker)}>
					<div className={`w-5 h-5 ${tierColor}`}></div>
				</button>
				{showColorPicker && (
					<div className='absolute right-0 mt-2 p-2 z-10   bg-white border rounded shadow-lg'>
						<div className='grid grid-cols-3 gap-10'>
							{colors.map((color, index) => (
								<button
									key={index}
									className={`w-6 h-6 ${color}`}
									onClick={() => handleColorChange(color)}
								></button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
