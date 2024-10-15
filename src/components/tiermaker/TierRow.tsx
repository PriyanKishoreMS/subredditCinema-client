import { Image } from "@/components/tiermaker/types";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { DraggableImage } from "./DraggableImage";

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
	renderControls: boolean;
	excludeDivRef?: React.RefObject<HTMLDivElement>;
	handleRemoveImage: (id: string) => void;
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
	renderControls,
	handleRemoveImage,
}) => {
	const { setNodeRef, node } = useDroppable({
		id: tier.id,
	});
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [localTierName, setLocalTierName] = useState(tier.name);
	const [height, setHeight] = useState<number | undefined>(20);
	// const heightRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setLocalTierName(tier.name);
	}, [tier.name]);

	useEffect(() => {
		setHeight(node.current?.clientHeight);
	}, [node.current?.clientHeight]);

	const handleColorChange = (color: string) => {
		changeTierColor(color);
		setShowColorPicker(false);
	};

	const handleInputChange = (e: React.FocusEvent<HTMLSpanElement>) => {
		const newName = e.currentTarget.textContent || "";
		setLocalTierName(newName);
		onTierNameChange(tier.id, newName);
	};

	return (
		<div className='flex mb-2 items-center justify-center'>
			<div
				className={`flex-shrink-0  w-20 mr-2 rounded-md ${tier.color} relative`}
				style={{ height: height }}
			>
				<span
					role='textbox'
					contentEditable={true}
					suppressContentEditableWarning={true}
					onBlur={e => handleInputChange(e)}
					style={{ whiteSpace: "pre-wrap" }}
					className='w-full h-full flex flex-grow items-center justify-center font-medium text-l bg-transparent text-black border-none text-center overflow-hidden p-2 whitespace-pre-wrap'
				>
					{localTierName}
				</span>
			</div>
			<div
				ref={setNodeRef}
				className={`flex-grow grid ${renderControls ? "md:grid-cols-10" : "md:grid-cols-12"} grid-cols-4 gap-2 bg-opacity-50 rounded-md p-2 min-h-[5rem] min-w-[5rem] backdrop-blur-md bg-gray-600 border border-gray-400`}
			>
				<SortableContext items={imageIds} strategy={rectSortingStrategy}>
					{imageIds.map(id => (
						<DraggableImage
							tier={tier.name}
							key={id}
							image={images[id]}
							handleRemoveImage={handleRemoveImage}
						/>
					))}
				</SortableContext>
			</div>
			{renderControls && (
				<div className='flex md:flex-row flex-col items-center justify-center'>
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
								<button
									className='w-full mt-2 py-1 bg-gray-200 text-gray-700 rounded'
									onClick={() => setShowColorPicker(false)}
								>
									Close
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

<style></style>;
