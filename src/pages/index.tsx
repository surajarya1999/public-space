import Head from "next/head";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import PostCard from "@/components/PostCard";
import PostComposer from "@/components/PostComposer";

export default function FeedPage() {
  const { posts, currentUser } = useApp();
  const [activeFilter, setActiveFilter] = useState<"all" | "trending" | "following">("all");

  const filteredPosts = activeFilter === "following" && currentUser
    ? posts.filter((p) => currentUser.friendIds.includes(p.authorId) || p.authorId === currentUser.id)
    : activeFilter === "trending"
    ? [...posts].sort((a, b) => b.likedBy.length - a.likedBy.length)
    : posts;

  return (
    <>
      <Head><title>Feed — PublicSpace</title></Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4">
            {currentUser ? (
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: "linear-gradient(135deg,#7c6dff,#ff6d8a)", fontFamily: "'Syne',sans-serif" }}>
                    {currentUser.avatar}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ fontFamily: "'Syne',sans-serif" }}>{currentUser.name}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>@{currentUser.handle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Friends", value: currentUser.friendIds.length },
                    { label: "Aaj", value: currentUser.postsToday },
                    { label: "Posts", value: posts.filter((p) => p.authorId === currentUser.id).length },
                  ].map((s) => (
                    <div key={s.label} className="py-2 rounded-xl" style={{ background: "var(--surface2)" }}>
                      <p className="font-bold text-sm" style={{ fontFamily: "'Syne',sans-serif", color: "var(--accent)" }}>{s.value}</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card p-5 text-center">
                <p className="text-sm mb-3" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
                  Login karo apni community dekho
                </p>
                <a href="/auth" className="btn-primary text-sm px-5 py-2 inline-block">Login →</a>
              </div>
            )}

            {/* Posting tiers card */}
            <div className="card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--muted)", fontFamily: "'Syne',sans-serif" }}>
                Posting Tiers
              </h3>
              {[
                { f: 0, label: "0 friends", limit: "Cannot post", color: "#ff6d8a" },
                { f: 1, label: "1 friend", limit: "1 post/day", color: "#ffd166" },
                { f: 2, label: "2 friends", limit: "2 posts/day", color: "#7c6dff" },
                { f: 11, label: "10+ friends", limit: "Unlimited ∞", color: "#6dffcc" },
              ].map((tier) => {
                const isActive = currentUser &&
                  ((tier.f === 0 && currentUser.friendIds.length === 0) ||
                  (tier.f === 1 && currentUser.friendIds.length === 1) ||
                  (tier.f === 2 && currentUser.friendIds.length >= 2 && currentUser.friendIds.length <= 10) ||
                  (tier.f === 11 && currentUser.friendIds.length > 10));
                return (
                  <div key={tier.label} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1"
                    style={{ background: isActive ? `${tier.color}12` : "transparent", border: isActive ? `1px solid ${tier.color}30` : "1px solid transparent" }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: tier.color }} />
                    <span className="flex-1" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>{tier.label}</span>
                    <span className="text-xs font-semibold" style={{ color: isActive ? tier.color : "var(--muted)" }}>{tier.limit}</span>
                    {isActive && <span className="text-xs">◀</span>}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Main feed */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <PostComposer />

            {/* Filters */}
            <div className="flex gap-2">
              {(["all", "trending", "following"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveFilter(tab)}
                  className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    color: activeFilter === tab ? "var(--accent)" : "var(--muted)",
                    background: activeFilter === tab ? "rgba(124,109,255,0.1)" : "transparent",
                    border: activeFilter === tab ? "1px solid rgba(124,109,255,0.25)" : "1px solid transparent",
                  }}>
                  {tab === "all" ? "Sab Posts" : tab === "trending" ? "🔥 Trending" : "👥 Following"}
                </button>
              ))}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-3xl mb-3">🌐</p>
                <p className="font-semibold mb-1" style={{ fontFamily: "'Syne',sans-serif" }}>Koi post nahi mili</p>
                <p className="text-sm" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
                  {activeFilter === "following" ? "Pehle kuch friends banao!" : "Pehli post banao!"}
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>
      </div>
    </>
  );
}
