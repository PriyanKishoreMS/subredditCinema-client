import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";
import { DraggableImage } from "./DraggableImage";
import { Image } from "./TierList";

interface TierRowProps {
	tier: {
		id: string;
		name: string;
		color: string;
	};
	changeTierColor: (color: string) => void;
	imageIds: string[];
	images: Record<string, Image>;
	onTierNameChange: (oldId: string, newName: string) => void;
	onRemoveTier: (id: string) => void;
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
	onTierNameChange,
	changeTierColor,
	onRemoveTier,
}) => {
	const { setNodeRef } = useDroppable({
		id: tier.id,
	});
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [localTierName, setLocalTierName] = useState(tier.name);

	useEffect(() => {
		setLocalTierName(tier.name);
	}, [tier.name]);

	const handleColorChange = (color: string) => {
		changeTierColor(color);
		setShowColorPicker(false);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLocalTierName(e.target.value);
	};

	const handleInputBlur = () => {
		if (localTierName !== tier.name) {
			onTierNameChange(tier.id, localTierName);
		}
	};

	return (
		<div className='flex mb-4 items-center'>
			<input
				type='text'
				value={localTierName}
				onChange={handleInputChange}
				onBlur={handleInputBlur}
				className='w-12 h-12 flex items-center justify-center font-bold text-xl bg-transparent border-none'
			/>
			<div
				ref={setNodeRef}
				className={`flex-1 bg-opacity-70 rounded-lg flex items-center space-x-2 p-2 min-h-[5rem] ${tier.color}`}
			>
				<SortableContext items={imageIds} strategy={rectSortingStrategy}>
					{imageIds.map(id => (
						<DraggableImage key={id} image={images[id]} />
					))}
				</SortableContext>
			</div>
			<button onClick={() => onRemoveTier(tier.id)} className='ml-2'>
				X
			</button>
			<div className='relative'>
				<button onClick={() => setShowColorPicker(!showColorPicker)}>
					<div className={`w-5 h-5 ${tier.color}`}></div>
				</button>
				{showColorPicker && (
					<div className='absolute right-0 mt-2 p-2 z-10 bg-white border rounded shadow-lg'>
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
