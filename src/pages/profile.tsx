import Head from "next/head";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/router";
import PostCard from "@/components/PostCard";

export default function ProfilePage() {
  const { currentUser, posts, updateUser, logout } = useApp();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [bio, setBio] = useState(currentUser?.bio || "");

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-3xl mb-3">◈</p>
        <p className="font-semibold mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>Profile dekhne ke liye login karo</p>
        <button onClick={() => router.push("/auth")} className="btn-primary px-6 py-2 mt-2">Login →</button>
      </div>
    );
  }

  const myPosts = posts.filter((p) => p.authorId === currentUser.id);
  const totalLikes = myPosts.reduce((sum, p) => sum + p.likedBy.length, 0);

  function handleSave() {
    if (!name.trim() || !currentUser) return;
    updateUser({ ...currentUser, name: name.trim(), bio: bio.trim() });
    setEditing(false);
  }

  function handleLogout() {
    logout();
    router.push("/auth");
  }

  const friendCount = currentUser.friendIds.length;
  const tierColor = friendCount === 0 ? "#ff6d8a" : friendCount <= 1 ? "#ffd166" : friendCount <= 10 ? "#7c6dff" : "#6dffcc";
  const tierLabel = friendCount === 0 ? "No friends (Locked)" : friendCount === 1 ? "1 friend — 1 post/day" : friendCount > 10 ? "10+ friends — Unlimited ∞" : `${friendCount} friends — ${friendCount} posts/day`;

  return (
    <>
      <Head><title>Profile — PublicSpace</title></Head>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Cover */}
        <div className="h-36 rounded-2xl mb-0"
          style={{ background: "linear-gradient(135deg,#7c6dff33,#ff6d8a33)", border: "1px solid var(--border)" }} />

        {/* Avatar + actions */}
        <div className="flex items-end gap-4 px-4 -mt-8 mb-6">
          <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#7c6dff,#ff6d8a)", borderColor: "var(--bg)", fontFamily: "'Syne',sans-serif" }}>
            {currentUser.avatar}
          </div>
          <div className="pb-2 flex-1">
            {editing ? (
              <div className="flex flex-col gap-2">
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className="rounded-lg px-3 py-1.5 text-sm outline-none"
                  style={{ background: "var(--surface2)", border: "1px solid var(--accent)", color: "var(--text)", fontFamily: "'Syne',sans-serif" }} />
                <input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Apna bio likho..."
                  className="rounded-lg px-3 py-1.5 text-sm outline-none"
                  style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "'DM Sans',sans-serif" }} />
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold" style={{ fontFamily: "'Syne',sans-serif" }}>{currentUser.name}</h1>
                <p className="text-sm" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>@{currentUser.handle}</p>
                {currentUser.bio && <p className="text-sm mt-1" style={{ fontFamily: "'DM Sans',sans-serif" }}>{currentUser.bio}</p>}
              </>
            )}
          </div>
          <div className="flex gap-2 mb-2">
            {editing ? (
              <>
                <button onClick={handleSave} className="btn-primary text-sm px-4 py-2">Save</button>
                <button onClick={() => setEditing(false)} className="btn-ghost text-sm px-4 py-2">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => { setName(currentUser.name); setBio(currentUser.bio); setEditing(true); }}
                  className="btn-ghost text-sm px-4 py-2">Edit</button>
                <button onClick={handleLogout} className="btn-ghost text-sm px-4 py-2" style={{ color: "#ff6d8a", borderColor: "rgba(255,109,138,0.3)" }}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Friends", value: friendCount },
            { label: "Posts", value: myPosts.length },
            { label: "Likes Mile", value: totalLikes },
            { label: "Aaj Post", value: currentUser.postsToday },
          ].map((s) => (
            <div key={s.label} className="card p-3 text-center">
              <p className="text-xl font-bold gradient-text" style={{ fontFamily: "'Syne',sans-serif" }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tier badge */}
        <div className="card p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: `${tierColor}20` }}>
            {friendCount > 10 ? "∞" : friendCount === 0 ? "🔒" : "✦"}
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: tierColor, fontFamily: "'Syne',sans-serif" }}>Current Tier</p>
            <p className="text-xs" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>{tierLabel}</p>
          </div>
          {friendCount < 10 && (
            <a href="/friends" className="ml-auto text-xs font-semibold" style={{ color: "var(--accent)", fontFamily: "'DM Sans',sans-serif" }}>
              Upgrade →
            </a>
          )}
        </div>

        {/* My posts */}
        <h2 className="text-sm font-bold mb-4 uppercase tracking-widest" style={{ color: "var(--muted)", fontFamily: "'Syne',sans-serif" }}>
          Meri Posts ({myPosts.length})
        </h2>

        {myPosts.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-3xl mb-3">📝</p>
            <p className="font-semibold mb-1" style={{ fontFamily: "'Syne',sans-serif" }}>Abhi tak koi post nahi</p>
            <p className="text-sm mb-4" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
              Feed par jao aur apni pehli post karo!
            </p>
            <a href="/" className="btn-primary text-sm px-5 py-2 inline-block">Feed par jao →</a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {myPosts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </>
  );
}