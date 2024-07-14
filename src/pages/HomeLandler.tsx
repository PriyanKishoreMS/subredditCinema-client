// src/App.tsx
import { Image, TierList } from "./TierList";

const initialImages: Image[] = [
	{
		id: "1",
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Vijay_at_Protest_of_the_Nadigar_Sangam.jpg/220px-Vijay_at_Protest_of_the_Nadigar_Sangam.jpg",
		tier: "start",
	},
	{
		id: "2",
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Sivakarthikeyan_at_Behindwoods_2024.jpg/220px-Sivakarthikeyan_at_Behindwoods_2024.jpg",
		tier: "start",
	},
	{
		id: "3",
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Ajith_Kumar_at_Irungattukottai_Race_Track.jpg/220px-Ajith_Kumar_at_Irungattukottai_Race_Track.jpg",
		tier: "start",
	},
	{
		id: "4",
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Vijay_Sethupathi_at_the_premiere_of_Merry_Christmas_%28cropped%29.jpg/220px-Vijay_Sethupathi_at_the_premiere_of_Merry_Christmas_%28cropped%29.jpg",
		tier: "start",
	},
	{
		id: "5",
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Rajinikanth_Felicitates_Writer_Kalaignanam_1.jpg/220px-Rajinikanth_Felicitates_Writer_Kalaignanam_1.jpg",
		tier: "start",
	},
];

function HomeLander() {
	return (
		<>
			<div className='App p-4'>
				<TierList initialImages={initialImages} />
			</div>
		</>
	);
}

export default HomeLander;
