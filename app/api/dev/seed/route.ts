import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";

// Seed 5-6 example companions. Only intended for local/dev use.
// POST /api/dev/seed
export async function POST() {
	if (process.env.NODE_ENV === "production") {
		return NextResponse.json(
			{ error: "Seeding disabled in production" },
			{ status: 403 }
		);
	}

	const { userId } = await auth();
	const supabase = createSupabaseClient();

	const companions = [
		{
			name: "Algebra Basics",
			subject: "maths",
			topic: "Linear Equations",
			voice: "female",
			style: "casual",
			duration: 15,
		},
		{
			name: "Grammar Guru",
			subject: "language",
			topic: "Past vs Present Tense",
			voice: "female",
			style: "formal",
			duration: 12,
		},
		{
			name: "Chem Lab Coach",
			subject: "science",
			topic: "Acids and Bases",
			voice: "male",
			style: "casual",
			duration: 18,
		},
		{
			name: "World Wars 101",
			subject: "history",
			topic: "WWII Overview",
			voice: "male",
			style: "formal",
			duration: 20,
		},
		{
			name: "JS Starter",
			subject: "coding",
			topic: "Variables and Loops",
			voice: "male",
			style: "casual",
			duration: 16,
		},
		{
			name: "Money Matters",
			subject: "finance",
			topic: "Simple vs Compound Interest",
			voice: "female",
			style: "formal",
			duration: 14,
		},
	];

	// Attach author if available; if RLS requires auth, make sure you're signed in.
	const rows = companions.map((c) => ({ ...c, author: userId ?? null }));

	const { data, error } = await supabase
		.from("companions")
		.insert(rows)
		.select();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ inserted: data?.length ?? 0, data }, { status: 200 });
}

// Optional: allow GET to preview what would be inserted (without writing)
export async function GET() {
	const examples = [
		"Algebra Basics (maths)",
		"Grammar Guru (language)",
		"Chem Lab Coach (science)",
		"World Wars 101 (history)",
		"JS Starter (coding)",
		"Money Matters (finance)",
	];
	return NextResponse.json({ examples }, { status: 200 });
}

