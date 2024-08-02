export interface Survey {
	id: number;
	username: string;
	avatar: string;
	subreddit: string;
	title: string;
	description: string;
	start_time: string;
	end_time: string;
	created_at: string;
	total_responses: number;
}

export interface SurveysResponse {
	metadata: {
		current_page: number;
		page_size: number;
		first_page: number;
		last_page: number;
		total_records: number;
	};
	surveys: Survey[];
}
