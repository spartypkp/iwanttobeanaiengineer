import { DailyBlog } from "@/lib/types";
import { init } from '@instantdb/admin';
const INSTANT_APP_ID = "3b4a73a0-ffc6-488a-b883-550004ff6e0a";
type Schema = {
	dailyBlogs: DailyBlog;
};

const db = init<Schema>({ appId: INSTANT_APP_ID, adminToken: process.env.INSTANT_APP_ADMIN_TOKEN! });
// Deprecated!
// export async function getBlogBySlug(slug: string): Promise<DailyBlog | null> {
// 	const supabase = createClient();
// 	const { data, error } = await supabase.from("daily_blogs").select().eq("date", slug).eq("status", "published").returns<DailyBlog[]>();

// 	if (!data) {
// 		return null;
// 	}

// 	return data[0];
// }


export async function getBlogBySlug(slug: string) {
	//console.log(`Getting blog by slug: ${slug}`);
	const query = {
		dailyBlogs: {
			$: {
				where: {
					date: slug,
				},
			},
			tasks: {},
		},
	};
	const data = await db.query(query);
	//console.log(JSON.stringify(data, null, 2));
	return data.dailyBlogs[0];
}
// Deprecated!
// export async function getAllBlogs() {
// 	const supabase = createClient();
// 	const { data, error } = await supabase.from("daily_blogs").select("*").eq("status", "published").order("day_count", { ascending: false }).returns<DailyBlog[]>();

// 	if (error) {
// 		console.log(`Error in getAllBlogs()`)
// 		console.log(error)
// 		return null;
// 	}
// 	return data;

// }
export async function getAllBlogs() {
	const query = {
		dailyBlogs: {
		},
	};
	const data = await db.query(query);
	const { dailyBlogs } = data;
	const sortedBlogs = dailyBlogs.sort((a: DailyBlog, b: DailyBlog) => b.day_count - a.day_count);
	return sortedBlogs;
}