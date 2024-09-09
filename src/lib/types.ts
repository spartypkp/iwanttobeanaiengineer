
// Interfaces for Task Submodel
export interface Task {
    task_goal?: string;
    task_description?: string;
    task_expected_difficulty?: number;
    task_planned_approach?: string;
    task_progress_notes?: string;
    challenges_encountered?: string;
    research_questions?: string;
    tools_used?: string;
    reflection_successes?: string;
    reflection_failures?: string;
    output_or_result?: string;
    time_spent_coding?: string;
    time_spent_researching?: string;
    time_spent_debugging?: string;
    follow_up_tasks?: string;
}

// Interfaces for Introduction Submodel
export interface Introduction {
    personal_context?: string;
    daily_goals?: string;
    learning_focus?: string;
    challenges?: string;
    plan_of_action?: string;
    focus_level?: number;
    enthusiasm_level?: number;
    burnout_level?: number;
    leetcode_hatred_level?: number;
}

// Interfaces for Reflection Submodel
export interface Reflection {
    technical_challenges?: string;
    interesting_bugs?: string;
    unanswered_questions?: string;
    learning_outcomes?: string;
    next_steps_short_term?: string;
    next_steps_long_term?: string;
    productivity_level?: number;
    distraction_level?: number;
    desire_to_play_steam_games_level?: number;
    overall_frustration_level?: number;
}

// Main Interface for Daily Blog
export interface DailyBlog {
    date: Date;
    introduction?: Introduction;
    tasks: Task[];
    reflection?: Reflection;
    created_at?: Date;
    updated_at?: Date;
}
