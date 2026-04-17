"use client";
import { useState } from "react";
import { useApp, Post, Comment } from "@/context/AppContext";
import { useRouter } from "next/router";

interface PostCardProps {
  post: Post;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now"; // 'Abhi abhi' -> 'Just now'
  if (m < 60) return `${m}m ago`; // minute pehle -> m ago
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`; // ghante pehle -> h ago
  return `${Math.floor(h / 24)}d ago`; // din pehle -> d ago
}

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#7c6dff,#ff6d8a)",
  "linear-gradient(135deg,#ff6d8a,#ffd166)",
  "linear-gradient(135deg,#6dffcc,#7c6dff)",
  "linear-gradient(135deg,#ffd166,#6dffcc)",
];

function avatarGradient(id: string) {
  const n = id.charCodeAt(id.length - 1) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[n];
}

function getTierBadge(friends: number) {
  if (friends === 0) return { label: "0 friends", color: "#ff6d8a", bg: "rgba(255,109,138,0.1)" };
  if (friends === 1) return { label: "1 friend", color: "#ffd166", bg: "rgba(255,209,102,0.1)" };
  if (friends <= 10) return { label: `${friends} friends`, color: "#7c6dff", bg: "rgba(124,109,255,0.1)" };
  return { label: `${friends} friends`, color: "#6dffcc", bg: "rgba(109,255,204,0.1)" };
}

export default function PostCard({ post }: PostCardProps) {
  const { currentUser, toggleLike, addComment, sharePost } = useApp();
  const router = useRouter();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [shareFlash, setShareFlash] = useState(false);

  const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;
  const tier = getTierBadge(post.authorFriendCount);

  function handleLike() {
    if (!currentUser) { router.push("/auth"); return; }
    toggleLike(post.id);
  }

  function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) { router.push("/auth"); return; }
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText("");
  }

  function handleShare() {
    if (!currentUser) { router.push("/auth"); return; }
    sharePost(post.id);
    setShareFlash(true);
    setTimeout(() => setShareFlash(false), 2000);
  }

  return (
    <article className="card card-hover overflow-hidden animate-fade-up">
      <div className="flex items-start gap-3 p-5 pb-3">
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
          style={{ background: avatarGradient(post.authorId), fontFamily: "'Syne',sans-serif" }}
        >
          {post.authorAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm" style={{ fontFamily: "'Syne',sans-serif" }}>{post.authorName}</span>
            {currentUser?.id === post.authorId && (
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(124,109,255,0.15)", color: "var(--accent)", fontSize: "0.65rem" }}>You</span> // 'Aap' -> 'You'
            )}
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: tier.color, background: tier.bg, border: `1px solid ${tier.color}30` }}>
              {tier.label}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      <div className="px-5 pb-3">
        <p className="text-sm leading-relaxed" style={{ color: "var(--text)", fontFamily: "'DM Sans',sans-serif" }}>{post.content}</p>
      </div>

      {/* Seed post image (external URL) */}
      {post.imageUrl && !post.mediaUrl && (
        <div className="mx-5 mb-4 rounded-xl overflow-hidden" style={{ background: "var(--surface2)" }}>
          <img src={post.imageUrl} alt="Post" className="w-full object-cover rounded-xl" style={{ maxHeight: 360, display: "block" }} />
        </div>
      )}

      {/* Uploaded media (Cloudinary URL) */}
      {post.mediaUrl && (
        <div className="mx-5 mb-4 rounded-xl overflow-hidden" style={{ background: "var(--surface2)" }}>
          {post.mediaType === "video" ? (
            <video src={post.mediaUrl} controls className="w-full rounded-xl" style={{ maxHeight: 360, display: "block" }} />
          ) : (
            <img src={post.mediaUrl} alt="Post" className="w-full object-cover rounded-xl" style={{ maxHeight: 360, display: "block" }} />
          )}
        </div>
      )}

      <div className="flex items-center gap-4 px-5 py-2 text-xs border-t border-b" style={{ borderColor: "var(--border)", color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
        <span style={{ color: isLiked ? "#ff6d8a" : "var(--muted)" }}>♥ {post.likedBy.length} likes</span>
        <button onClick={() => setShowComments(!showComments)} className="hover:underline">💬 {post.comments.length} comments</button>
        <span>↗ {post.shares} shares</span>
      </div>

      <div className="flex items-center px-2 py-1">
        <button onClick={handleLike} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
          style={{ color: isLiked ? "#ff6d8a" : "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
          {isLiked ? "♥" : "♡"} {isLiked ? "Liked" : "Like"}
        </button>
        <button onClick={() => { if (!currentUser) { router.push("/auth"); return; } setShowComments(!showComments); }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
          style={{ color: showComments ? "var(--accent)" : "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
          💬 Comment
        </button>
        <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
          style={{ color: shareFlash ? "var(--accent3)" : "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
          ↗ {shareFlash ? "Shared!" : "Share"}
        </button>
      </div>

      {showComments && (
        <div className="border-t px-5 pt-4 pb-4" style={{ borderColor: "var(--border)" }}>
          {post.comments.length > 0 && (
            <div className="flex flex-col gap-3 mb-4">
              {post.comments.map((c: Comment) => (
                <div key={c.id} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: avatarGradient(c.authorId), fontFamily: "'Syne',sans-serif" }}>
                    {c.authorAvatar}
                  </div>
                  <div className="flex-1 px-3 py-2 rounded-xl text-sm" style={{ background: "var(--surface2)", fontFamily: "'DM Sans',sans-serif" }}>
                    <span className="font-semibold text-xs mr-2" style={{ fontFamily: "'Syne',sans-serif", color: "var(--accent)" }}>{c.authorName}</span>
                    <span style={{ color: "var(--text)" }}>{c.text}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {currentUser ? (
            <form onSubmit={handleComment} className="flex gap-2">
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-1"
                style={{ background: avatarGradient(currentUser.id), fontFamily: "'Syne',sans-serif" }}>
                {currentUser.avatar}
              </div>
              <input value={commentText} onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..." className="flex-1 rounded-xl px-3 py-2 text-sm outline-none" // 'Comment likho' -> 'Write a comment'
                style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "'DM Sans',sans-serif" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
              <button type="submit" className="btn-primary text-xs px-4 py-2" disabled={!commentText.trim()}>Post</button>
            </form>
          ) : (
            <p className="text-xs text-center py-2" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
              Please <button onClick={() => router.push("/auth")} style={{ color: "var(--accent)" }}>Login</button> to add a comment. // 'Login karo... comment karne ke liye'
            </p>
          )}
        </div>
      )}
    </article>
  );
}