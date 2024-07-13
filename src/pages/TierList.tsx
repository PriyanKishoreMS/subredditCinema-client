import {
	DndContext,
	DragEndEvent,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import React, { useState } from "react";
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
		if (over) {
			const activeId = active.id as string;
			const overId = over.id as string;
			setTierState(prev => {
				const newState = { ...prev };
				let sourceTier = Object.keys(newState).find(tier =>
					newState[tier].includes(activeId)
				)!;
				let targetTier = overId;
				let targetIndex = -1;

				if (images[overId]) {
					targetTier = Object.keys(newState).find(tier =>
						newState[tier].includes(overId)
					)!;
					targetIndex = newState[targetTier].indexOf(overId);
				}

				newState[sourceTier] = newState[sourceTier].filter(
					id => id !== activeId
				);

				if (targetIndex !== -1) {
					newState[targetTier].splice(targetIndex + 1, 0, activeId);
				} else {
					newState[targetTier].push(activeId);
				}

				images[activeId].tier = targetTier;
				return newState;
			});
		}
	};

	return (
		<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
		</DndContext>
	);
};
