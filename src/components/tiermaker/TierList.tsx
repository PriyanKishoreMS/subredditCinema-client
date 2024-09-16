import { Button } from "@/components/ui/button";
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
import { useToPng } from "@hugocxl/react-to-image";
import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { RxCardStackPlus } from "react-icons/rx";
import { v4 as uuidv4 } from "uuid";
import { DraggableImage } from "./DraggableImage";
import { InitRow } from "./InitRow";
import { TierRow } from "./TierRow";
import { Image as CImage, Tier } from "./types";

export interface TierListProps {
	initialImages: CImage[];
	title: string;
	setTitle: React.Dispatch<React.SetStateAction<string>>;
	tiers: Tier[];
	setTiers: React.Dispatch<React.SetStateAction<Tier[]>>;
	images: Record<string, CImage>;
	setImages: React.Dispatch<React.SetStateAction<Record<string, CImage>>>;
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
	const [items, setItems] = useState<CImage[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [tierState, setTierState] = useState<Record<string, string[]>>(() => {
		const initial: Record<string, string[]> = { start: [] };
		tiers.forEach(tier => {
			initial[tier.id] = [];
		});
		return initial;
	});

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
			{} as Record<string, CImage>
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

	const [renderControls, setRenderControls] = useState(true);
	const excludeDivRef = React.useRef<HTMLDivElement>(null);

	const [triggerConvert, setTriggerConvert] = useState(false);

	useEffect(() => {
		if (!renderControls && triggerConvert) {
			convertToPng();
			setTriggerConvert(false);
		}
	}, [renderControls, triggerConvert]);

	const handleConvert = () => {
		setRenderControls(false);
		setTriggerConvert(true);
	};

	const [state, convertToPng, ref] = useToPng({
		onSuccess: async (data: string) => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			if (!ctx) {
				console.error("Unable to get 2D context");
				return;
			}

			const bgImage = new Image();
			const htmlImage = new Image();

			bgImage.src = "/twbg2.jpg";
			htmlImage.src = data;

			await Promise.all([
				new Promise<void>(resolve => (bgImage.onload = () => resolve())),
				new Promise<void>(resolve => (htmlImage.onload = () => resolve())),
			]);

			canvas.width = htmlImage.width;
			canvas.height = htmlImage.height;

			ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

			ctx.globalAlpha = 1;
			ctx.drawImage(htmlImage, 0, 0);
			ctx.globalAlpha = 1.0;

			const finalImage = canvas.toDataURL("image/jpeg");

			const link = document.createElement("a");
			link.download = title + " subredditcinema.priyankishore.dev.jpg";
			link.href = finalImage;
			link.click();

			setRenderControls(true);
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
									renderControls={renderControls}
									excludeDivRef={excludeDivRef}
								/>
							))}
						</div>
						<div className='flex items-center justify-between mt-4'>
							<Button
								onClick={addTier}
								className='px-8 py-2 flex flex-row items-center justify-center gap-3  text-white text font-bold bg-blue-600 rounded-md disabled:opacity-50'
								disabled={tiers.length >= 9}
							>
								<RxCardStackPlus className='text-2xl' />
								Add Tier
							</Button>
							<Button className='px-8 py-2 gap-3' onClick={handleConvert}>
								<FaDownload className='text-lg' />
								Download as Image
							</Button>
						</div>
						<div className='flex lg:flex-row flex-col w-full'>
							<InitRow
								tier='start'
								imageIds={tierState["start"]}
								images={images}
							/>
						</div>
					</div>

					<DragOverlay>
						{activeId && images[activeId] && (
							<DraggableImage image={images[activeId]} />
						)}
					</DragOverlay>
				</SortableContext>
			</DndContext>
		</div>
	);
};
