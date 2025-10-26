import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CompanionList from '@/components/companionList';
import { getUserBookmarks } from '@/lib/actions/companion.action';

export const metadata = {
    title: 'Bookmarks | Lenify',
};

export default async function BookmarksPage() {
    const user = await currentUser();
    if (!user?.id) {
        redirect('/sign-in');
    }

    const companions = await getUserBookmarks(user.id);

    return (
        <main>
            <section className="flex flex-col gap-6">
                <h1 className="text-3xl font-bold">Your Bookmarks</h1>
                {companions && companions.length > 0 ? (
                    <CompanionList title="Bookmarked" companions={companions as any} />
                ) : (
                    <div className="p-6 border border-black rounded-3xl shadow-md max-sm:rounded-none max-sm:border-0">
                        <p className="text-gray-600">You haven’t bookmarked any companions yet.</p>
                    </div>
                )}
            </section>
        </main>
    );
}
