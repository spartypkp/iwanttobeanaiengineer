import { DailyBlog, Task, Introduction, Reflection } from "@/lib/types";
import fs from "fs";
import { join } from "path";
import { createClient } from "./utils/supabase/server";

export async function getBlogBySlug(slug: string): Promise<DailyBlog | null> {
	const supabase = createClient();
	const { data, error } = await supabase.from("daily_blogs").select().eq("date", slug).returns<DailyBlog[]>();
	console.log(error)
	if (!data) {
		return null;
	}
	
	return data[0];
}

export async function getAllBlogs() {
	const supabase = createClient();
	const { data, error } = await supabase.from("daily_blogs").select("*").returns<DailyBlog[]>();
	
	if (error) {
		console.log(`Error in getAllBlogs()`)
		console.log(error)
		return null;
	}
	return data;

}