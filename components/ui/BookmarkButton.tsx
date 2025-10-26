"use client";

import React from "react";

type Props = {
  companionId: string;
  initialBookmarked?: boolean;
};

export default function BookmarkButton({ companionId, initialBookmarked }: Props) {
  const [bookmarked, setBookmarked] = React.useState<boolean>(!!initialBookmarked);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [initialized, setInitialized] = React.useState<boolean>(!!initialBookmarked);

  React.useEffect(() => {
    if (initialized) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/bookmarks?companionId=${encodeURIComponent(companionId)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as { bookmarked: boolean };
        if (active) {
          setBookmarked(!!data.bookmarked);
          setInitialized(true);
        }
      } catch {
        // noop
      }
    })();
    return () => {
      active = false;
    };
  }, [companionId, initialized]);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    const next = !bookmarked;
    // optimistic update
    setBookmarked(next);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companionId, action: next ? "add" : "remove" }),
      });
      if (!res.ok) {
        // revert on failure
        setBookmarked(!next);
      }
    } catch {
      setBookmarked(!next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="companion-bookmark"
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      onClick={toggle}
      disabled={loading}
      title={bookmarked ? "Bookmarked" : "Bookmark"}
    >
      {/* Keep using img to avoid adding next/image here; matches project pattern */}
      <img
        src={"/icons/bookmark.svg"}
        alt={bookmarked ? "Bookmarked" : "Bookmark"}
        width={18}
        height={18}
        style={bookmarked ? { filter: "brightness(0) saturate(100%) invert(32%) sepia(80%) saturate(2277%) hue-rotate(333deg) brightness(99%) contrast(97%)" } : undefined}
      />
    </button>
  );
}
