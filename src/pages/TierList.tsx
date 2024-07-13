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
import React, { useState } from "react";
import { DraggableImage } from "./DraggableImage";
import { InitRow } from "./InitRow";
import { TierRow } from "./TierRow";

export interface Image {
	id: string;
	src: string;
	tier: string;
}

interface TierListProps {
	initialImages: Image[];
}

const tiers: {
	tier: string;
	tierColor: string;
	key: number;
}[] = [
	{ key: 1, tier: "S", tierColor: "bg-green-600" },
	{ key: 2, tier: "A", tierColor: "bg-yellow-300" },
	{ key: 3, tier: "B", tierColor: "bg-yellow-500" },
	{ key: 4, tier: "C", tierColor: "bg-blue-400" },
	{ key: 6, tier: "D", tierColor: "bg-red-600" },
];

export const TierList: React.FC<TierListProps> = ({ initialImages }) => {
	const [items, setItems] = useState<Image[]>(initialImages);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [tierState, setTierState] = useState<Record<string, string[]>>(() => {
		const initial: Record<string, string[]> = {
			start: [],
		};
		tiers.forEach(tier => {
			initial[tier.tier] = [];
		});
		initialImages.forEach(img => {
			if (initial[img.tier]) {
				initial[img.tier].push(img.id);
			} else {
				initial.start.push(img.id);
			}
		});
		return initial;
	});

	const [images] = useState<Record<string, Image>>(() => {
		return initialImages.reduce((acc, img) => {
			acc[img.id] = img;
			return acc;
		}, {} as Record<string, Image>);
	});

	const sensors = useSensors(
		// useSensor(PointerSensor),
		// useSensor(KeyboardSensor, {
		// 	coordinateGetter: sortableKeyboardCoordinates,
		// }),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250,
				tolerance: 5,
			},
		}),
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 10,
			},
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
		const { active } = event;
		setActiveId(active.id as string);
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

	return (
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
				<div className='max-w-4xl mx-auto'>
					{tiers.map(tier => (
						<TierRow
							key={tier.key}
							tier={tier.tier}
							imageIds={tierState[tier.tier]}
							images={images}
							tierColor={tier.tierColor}
						/>
					))}
					<InitRow tier='start' imageIds={tierState["start"]} images={images} />
				</div>
				<DragOverlay>
					{activeId ? (
						<DraggableImage
							image={items.find(item => item.id === activeId) || items[0]}
						/>
					) : null}
				</DragOverlay>
			</SortableContext>
		</DndContext>
	);
};
