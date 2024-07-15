import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
import { HiOutlineColorSwatch } from "react-icons/hi";
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
		<div className='flex mb-4 items-center justify-center'>
			<div className='flex-shrink-0 lg:w-32 w-10 mr-2'>
				<input
					type='text'
					value={localTierName}
					onChange={handleInputChange}
					onBlur={handleInputBlur}
					className='w-full h-12 flex items-center justify-end font-bold text-xl bg-transparent border-none text-right pr-2'
					style={{ minWidth: "24px" }}
				/>
			</div>
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
			<button
				onClick={() => onRemoveTier(tier.id)}
				className='mx-2 ml-5 text-center rounded-full  bg-opacity-50 '
			>
				<FaDeleteLeft className='text-white text-xl text-center' />
			</button>
			<div className='relative flex'>
				<button onClick={() => setShowColorPicker(!showColorPicker)}>
					<HiOutlineColorSwatch
						className={`text-white ml-2 rounded-full p-1.5 ${tier.color} text-4xl`}
					/>
				</button>
				{showColorPicker && (
					<div className='absolute right-0 mt-2 p-4 w-40 z-10 bg-white bg-opacity-50 backdrop-blur-xl border rounded shadow-lg'>
						<div className='grid grid-cols-3 gap-2 mb-2'>
							{colors.map((color, index) => (
								<button
									key={index}
									className={`w-8 h-8 ${color} rounded-full`}
									onClick={() => handleColorChange(color)}
								></button>
							))}
						</div>
						<Button
							size='md'
							variant='flat'
							radius='sm'
							className='w-full mt-2 py-1 bg-gray-200 text-gray-700'
							onClick={() => setShowColorPicker(false)}
						>
							Close
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
