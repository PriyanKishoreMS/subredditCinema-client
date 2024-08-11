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

export type SurveyResponse = {
	id: number;
	username: string;
	avatar: string;
	subreddit: string;
	title: string;
	description: string;
	created_at: string;
	end_time: string;
	is_result_public: boolean;
	total_responses: number;
	questions: Array<{
		question_id: number;
		order: number;
		text: string;
		type: "single" | "multiple" | "text";
		is_required: boolean;
		options: Array<{
			question_id: number;
			option_id: number;
			order: number;
			text: string;
		}> | null;
	}>;
};

export type Answer = {
	question_id: number;
	selected_option_id?: number;
	selected_option_ids?: number[];
	answer_text?: string;
};
