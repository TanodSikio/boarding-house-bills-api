import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { profiles } from "@/db/schema";
import { cache } from "react";
import { redirect } from "next/navigation";

export type Profile = typeof profiles.$inferSelect;

export async function getProfile(request?: Request): Promise<Profile | null> {
    const token = request?.headers.get("Authorization")?.replace("Bearer ", "");
    const supabase = await createClient();

    const { data } = await supabase.auth.getClaims(token).catch(() => ({ data: null}));
    if(!data) return null;

    const { sub: id, email = ""} = data.claims;
    await db.insert(profiles).values({ id, email }).onConflictDoNothing();
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile;
}

export const verifyUser = cache(async () => {
    const profile = await getProfile();
    if(!profile) redirect("/login");
    return profile;
});