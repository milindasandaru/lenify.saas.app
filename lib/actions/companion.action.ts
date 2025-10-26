"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseClient, createSupabaseServerClient } from "@/lib/supabase";

// Minimal companion shape for Supabase rows (extend as your schema evolves)
type DbCompanion = {
    id: string;
    name: string;
    subject: string;
    topic: string;
    voice?: string;
    style?: string;
    duration?: number;
    [key: string]: unknown;
}

export const createCompanion = async (formData: CreateCompanion) => {
    const {userId: author} = await auth();
    // Use server client to satisfy RLS (service role) while still stamping the author.
    const supabase = createSupabaseServerClient();
    

    const {data, error} = await supabase.from('companions').insert({
        ...formData,
        author
    }).select().single();

    if (error || !data) {
        throw new Error(error?.message || 'Failed to create companion');
    }

    return data;
}

export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
    const supabase = createSupabaseClient();

    let query = supabase.from('companions').select();

    const subjectTerm = Array.isArray(subject) ? subject[0] : subject;
    const topicTerm = Array.isArray(topic) ? topic[0] : topic;

    if (subjectTerm) {
        query = query.ilike('subject', `%${subjectTerm}%`);
    }
    if (topicTerm) {
        // Search in topic or name when topicTerm provided
        query = query.or(`topic.ilike.%${topicTerm}%,name.ilike.%${topicTerm}%`);
    }
    query = query.range((page - 1) * limit, page * limit - 1).order('created_at', { ascending: false });

    const { data: companions, error } = await query;

    if (error) {
        throw new Error(error.message);
    }

    return companions;
}

export const getComapnion = async (id: string) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('id', id)
        .single();

    if (error || !data) {
        throw new Error(error?.message || 'Companion not found');
    }

    return data;
}

export const addToSessionHistory = async (companionId: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');
    // Use server client for inserts guarded by RLS
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('session_history')
        .insert({
            companion_id: companionId,
            user_id: userId,
        })
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}

export const getRecentSessions = async (limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select('companion:companion_id(*)')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw new Error(error.message);

    const rows = (data ?? []) as unknown as Array<{ companion: DbCompanion | null }>
    return rows.map((r) => r.companion).filter(Boolean);
}


export const getUserSessions = async (userId: string, limit = 10 ) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select('companion:companion_id(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw new Error(error.message);

    const rows = (data ?? []) as unknown as Array<{ companion: DbCompanion | null }>
    return rows.map((r) => r.companion).filter(Boolean);
}

export const getUserCompanions = async (userId: string ) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('author', userId)

    if (error) throw new Error(error.message);

    return data;
}

export const newCompanionPermissions = async () => {
  const { userId } = await auth();
  if (!userId) return false;

  // Determine plan from Clerk user metadata, default to 'free'
  const user = await currentUser();
    const rawPlan = ((user?.publicMetadata as any)?.plan || (user?.privateMetadata as any)?.plan || "basic") as string;
    const plan = String(rawPlan).toLowerCase(); // expected: 'basic' | 'core' | 'pro'

    if (plan === "pro") return true; // unlimited

    // Map plan to limits; allow overriding via metadata.companion_limit
    const metaLimit = Number((user?.publicMetadata as any)?.companion_limit ?? (user?.privateMetadata as any)?.companion_limit);
    // Support legacy synonyms: 'plus' => 'core', 'free' => 'basic'
    const normalized = plan === "plus" ? "core" : plan === "free" ? "basic" : plan;
    const defaultLimit = normalized === "core" ? 10 : 3; // core ~ mid tier, basic ~ entry tier
    const limit = Number.isFinite(metaLimit) && metaLimit > 0 ? metaLimit : defaultLimit;

  const supabase = createSupabaseClient();
  const { count, error } = await supabase
    .from("companions")
    .select("*", { count: "exact", head: true })
    .eq("author", userId);

  if (error) throw new Error(error.message);

  const companionCount = count ?? 0;
  return companionCount < limit;
};