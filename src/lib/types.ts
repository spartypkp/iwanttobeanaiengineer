
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

export const TaskFieldOrder: (keyof Task)[] = [
    'task_goal',
    'task_description',
    'task_expected_difficulty',
    'task_planned_approach',
    'task_progress_notes',
    'challenges_encountered',
    'research_questions',
    'tools_used',
    'reflection_successes',
    'reflection_failures',
    'output_or_result',
    'time_spent_coding',
    'time_spent_researching',
    'time_spent_debugging',
    'follow_up_tasks'
];


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

export const IntroductionFieldOrder: (keyof Introduction)[] = [
    'personal_context',
    'daily_goals',
    'learning_focus',
    'challenges',
    'plan_of_action',
    'focus_level',
    'enthusiasm_level',
    'burnout_level',
    'leetcode_hatred_level'
];


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

export const ReflectionFieldOrder: (keyof Reflection)[] = [
    'technical_challenges',
    'interesting_bugs',
    'unanswered_questions',
    'learning_outcomes',
    'next_steps_short_term',
    'next_steps_long_term',
    'productivity_level',
    'distraction_level',
    'desire_to_play_steam_games_level',
    'overall_frustration_level'
];


// Main Interface for Daily Blog
export interface DailyBlog {
    date: Date;
    introduction?: Introduction;
    tasks: Task[];
    reflection?: Reflection;
    created_at?: Date;
    updated_at?: Date;
}
