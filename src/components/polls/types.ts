export interface Poll {
	id: number;
	reddit_uid: string;
	subreddit: string;
	title: string;
	description: string;
	options: PollOption[];
	voting_method: string;
	start_time: string;
	end_time: string;
	is_active: boolean;
	user_name: string;
	user_avatar: string;
	total_votes: number;
	vote_count: Record<string, number>;
}

export interface PollOption {
	id: number;
	text: string;
}

export interface PollsResponse {
	metadata: {
		current_page: number;
		page_size: number;
		first_page: number;
		last_page: number;
		total_records: number;
	};
	polls: Poll[];
}
