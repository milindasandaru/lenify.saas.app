import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export const createSupabaseClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        // Provide a clear, actionable error when envs are missing to avoid opaque `fetch failed` crashes.
        throw new Error(
            "Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
        );
    }

    // For Clerk integration with Postgres RLS based on Clerk JWT, you can forward a token via global headers.
    // Most reads/writes for public tables will work with the anon key alone. Uncomment if you need JWT forwarding.
    // const clerkToken = await auth().then((a) => a.getToken());

    return createClient(url, anonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });
};

// Server-only client using the Service Role key to bypass RLS for trusted server actions/routes.
// NEVER expose the service role key to the client. Keep it only in server env (.env.local / hosting secrets).
export const createSupabaseServerClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        throw new Error(
            "Supabase server envs missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server env."
        );
    }

    return createClient(url, serviceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });
};