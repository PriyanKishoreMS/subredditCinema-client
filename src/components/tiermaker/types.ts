export interface Image {
	id: string;
	src: string;
	name: string;
	tier: string;
}

export interface Tier {
	id: string;
	name: string;
	color: string;
}

export type tierListData = {
	title: string;
	subreddit: string;
	tiers: {
		label: string;
		color: string;
	}[];
	urls: string[];
};

export interface TierListsResponse {
	metadata: {
		current_page: number;
		page_size: number;
		first_page: number;
		last_page: number;
		total_records: number;
	};
	tier_lists: Tierlists[];
}

export interface Tierlists {
	id: number;
	reddit_uid: string;
	title: string;
	subreddit: string;
	created_at: string;
	image_url: string;
	avatar: string;
	username: string;
}

export interface TierlistResponse {
	id: number; 
	reddit_uid: string;
	title: string;
	subreddit: string;
	tiers: { label: string; color: string }[];
	urls: string[];
	created_at: string;
}
