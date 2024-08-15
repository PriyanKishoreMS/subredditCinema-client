import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
} from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";

import { useToJpeg } from "@hugocxl/react-to-image";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import { DraggableImage } from "./DraggableImage";
import { InitRow } from "./InitRow";
import { TierRow } from "./TierRow";
import { Image, Tier } from "./types";

export interface TierListProps {
	initialImages: Image[];
	title: string;
	setTitle: React.Dispatch<React.SetStateAction<string>>;
	tiers: Tier[];
	setTiers: React.Dispatch<React.SetStateAction<Tier[]>>;
	images: Record<string, Image>;
	setImages: React.Dispatch<React.SetStateAction<Record<string, Image>>>;
}

export const TierList: React.FC<TierListProps> = ({
	initialImages,
	title,
	setTitle,
	tiers,
	setTiers,
	images,
	setImages,
}) => {
	const [items, setItems] = useState<Image[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [tierState, setTierState] = useState<Record<string, string[]>>(() => {
		const initial: Record<string, string[]> = { start: [] };
		tiers.forEach(tier => {
			initial[tier.id] = [];
		});
		return initial;
	});

	console.log(tiers, "tiers in tierlist");

	// const [images] = useState<Record<string, Image>>(() =>
	// 	initialImages.reduce((acc, img) => {
	// 		acc[img.id] = img;
	// 		return acc;
	// 	}, {} as Record<string, Image>)
	// );

	useEffect(() => {
		const newImages = initialImages.reduce(
			(acc, img) => {
				acc[img.id] = img;
				return acc;
			},
			{} as Record<string, Image>
		);

		setImages(prevImages => ({ ...prevImages, ...newImages }));

		setItems(prevItems => {
			const existingIds = new Set(prevItems.map(item => item.id));
			const newItems = initialImages.filter(img => !existingIds.has(img.id));
			return [...prevItems, ...newItems];
		});

		setTierState(prev => {
			const newState = { ...prev };
			initialImages.forEach(img => {
				if (!Object.values(newState).flat().includes(img.id)) {
					newState.start.push(img.id);
				}
			});
			return newState;
		});
	}, [initialImages]);

	const sensors = useSensors(
		useSensor(TouchSensor, {
			activationConstraint: { delay: 250, tolerance: 5 },
		}),
		useSensor(MouseSensor, {
			activationConstraint: { distance: 10 },
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		setTierState(prev => {
			const newState = { ...prev };
			const sourceTier = Object.keys(newState).find(tier =>
				newState[tier].includes(activeId)
			);
			const targetTier = Object.keys(newState).find(tier =>
				newState[tier].includes(overId)
			);

			if (sourceTier) {
				if (sourceTier === targetTier) {
					const oldIndex = newState[sourceTier].indexOf(activeId);
					const newIndex = newState[sourceTier].indexOf(overId);
					newState[sourceTier] = arrayMove(
						newState[sourceTier],
						oldIndex,
						newIndex
					);
				} else if (targetTier) {
					newState[sourceTier] = newState[sourceTier].filter(
						id => id !== activeId
					);
					const targetIndex = newState[targetTier].indexOf(overId);
					newState[targetTier].splice(targetIndex, 0, activeId);
				} else {
					newState[sourceTier] = newState[sourceTier].filter(
						id => id !== activeId
					);
					newState[overId] = [...(newState[overId] || []), activeId];
				}
			}

			return newState;
		});
	};

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeItem = items.find(item => item.id === active.id);
		const overItem = items.find(item => item.id === over.id);

		if (activeItem && overItem && activeItem.tier !== overItem.tier) {
			setItems(items => {
				const oldIndex = items.findIndex(item => item.id === active.id);
				const newIndex = items.findIndex(item => item.id === over.id);

				const newItems = arrayMove(items, oldIndex, newIndex);
				newItems[newIndex] = { ...newItems[newIndex], tier: overItem.tier };

				return newItems;
			});
		}
	};

	const handleTierNameChange = (tierId: string, newName: string) => {
		setTiers(prev => {
			const updatedTiers = prev.map(tier => {
				if (tier.id === tierId) {
					return { ...tier, name: newName };
				}
				return tier;
			});
			return updatedTiers;
		});
	};

	const addTier = () => {
		if (tiers.length >= 9) return;
		const newId = `Tier${tiers.length + 1}`;
		const newTier: Tier = {
			id: uuidv4(),
			name: newId,
			color: "bg-gray-400",
		};
		setTiers(prev => [...prev, newTier]);
		setTierState(prev => ({ ...prev, [newId]: [] }));
	};

	const removeTier = (tierId: string) => {
		if (tiers.length <= 2) return;

		setTiers(prev => prev.filter(tier => tier.id !== tierId));

		setTierState(prev => {
			const newState = { ...prev };
			const removedTierImages = newState[tierId] || [];
			delete newState[tierId];

			newState.start = [...newState.start, ...removedTierImages];

			setItems(prevItems =>
				prevItems.map(item =>
					removedTierImages.includes(item.id)
						? { ...item, tier: "start" }
						: item
				)
			);

			return newState;
		});
	};

	const changeTierColor = (tierId: string, newColor: string) => {
		setTiers(prev =>
			prev.map(tier =>
				tier.id === tierId ? { ...tier, color: newColor } : tier
			)
		);
	};

	const [state, convertToJpeg, ref] = useToJpeg({
		onSuccess: (data: any) => {
			// create a background canvas
			const link = document.createElement("a");
			link.download = "tiermaker.png";
			link.href = data;
			link.click();
		},
	});

	return (
		<div>
			<DndContext
				sensors={sensors}
				onDragEnd={handleDragEnd}
				onDragOver={handleDragOver}
				onDragStart={handleDragStart}
			>
				<SortableContext
					items={Object.values(tierState).flat()}
					strategy={rectSortingStrategy}
				>
					<div className='max-w-4xl w-full mx-auto'>
						<div ref={ref}>
							<input
								type='text'
								value={title}
								onChange={e => setTitle(e.target.value)}
								className='text-3xl font-bold text-center my-8 w-full bg-transparent border-none'
							/>
							{tiers.map(tier => (
								<TierRow
									key={tier.id}
									tier={tier}
									imageIds={tierState[tier.id] || []}
									images={images}
									changeTierColor={newColor =>
										changeTierColor(tier.id, newColor)
									}
									onTierNameChange={handleTierNameChange}
									onRemoveTier={tierId => removeTier(tierId)}
								/>
							))}
						</div>
						<InitRow
							tier='start'
							imageIds={tierState["start"]}
							images={images}
						/>
						<div className='flex justify-center mt-4'>
							<button
								onClick={addTier}
								className='px-8 py-2  text-white text font-bold bg-blue-600 rounded-md shadow-lg shadow-blue-900 disabled:opacity-50'
								disabled={tiers.length >= 9}
							>
								Add Tier
							</button>
						</div>
					</div>
					<DragOverlay>
						{activeId && images[activeId] && (
							<DraggableImage image={images[activeId]} />
						)}
					</DragOverlay>
				</SortableContext>
			</DndContext>
			<Button onClick={convertToJpeg}>Download as Image</Button>
		</div>
	);
};
