"use client";
import Head from "next/head";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/router";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#7c6dff,#ff6d8a)",
  "linear-gradient(135deg,#ff6d8a,#ffd166)",
  "linear-gradient(135deg,#6dffcc,#7c6dff)",
  "linear-gradient(135deg,#ffd166,#6dffcc)",
];

function ag(id: string) {
  return AVATAR_GRADIENTS[id.charCodeAt(id.length - 1) % AVATAR_GRADIENTS.length];
}

export default function FriendsPage() {
  const { currentUser, allUsers, addFriend, removeFriend, isFriend } = useApp();
  const router = useRouter();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-3xl mb-3">👥</p>
        <p className="font-semibold mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>View Friends</p>
        <p className="text-sm mb-4" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
          Please login first to see and manage your friends list.
        </p>
        <button onClick={() => router.push("/auth")} className="btn-primary px-6 py-2">Login →</button>
      </div>
    );
  }

  const myFriends = allUsers.filter((u) => currentUser.friendIds.includes(u.id));
  const suggestions = allUsers.filter((u) => u.id !== currentUser.id && !currentUser.friendIds.includes(u.id));
  const totalFriends = currentUser.friendIds.length;

  const TIERS = [
    { friends: "0", icon: "🔒", label: "0 friends", detail: "Posting disabled", color: "#ff6d8a", active: totalFriends === 0 },
    { friends: "1", icon: "✦", label: "1 friend", detail: "1 post per day", color: "#ffd166", active: totalFriends === 1 },
    { friends: "2–10", icon: "✦✦", label: "2–10 friends", detail: "Posts equal to friend count", color: "#7c6dff", active: totalFriends >= 2 && totalFriends <= 10 },
    { friends: "10+", icon: "∞", label: "10+ friends", detail: "Unlimited posts unlocked!", color: "#6dffcc", active: totalFriends > 10 },
  ];

  return (
    <>
      <Head><title>Friends — PublicSpace</title></Head>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold gradient-text mb-1" style={{ fontFamily: "'Syne',sans-serif" }}>Friends</h1>
          <p style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
            You have <span style={{ color: "var(--accent)", fontWeight: 600 }}>{totalFriends} friend{totalFriends !== 1 ? "s" : ""}</span>
            {totalFriends < 10 && ` — Make ${10 - totalFriends} more to unlock unlimited posting!`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Tiers + Progress */}
          <div className="flex flex-col gap-4">
            <div className="card p-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--muted)", fontFamily: "'Syne',sans-serif" }}>
                Posting Tiers
              </h2>
              {TIERS.map((tier) => (
                <div key={tier.friends} className="flex items-center gap-3 p-3 rounded-xl mb-2 transition-all"
                  style={{ background: tier.active ? `${tier.color}12` : "var(--surface2)", border: tier.active ? `1px solid ${tier.color}40` : "1px solid var(--border)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${tier.color}20` }}>{tier.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ fontFamily: "'Syne',sans-serif", color: tier.active ? tier.color : "var(--text)" }}>
                      {tier.label}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{tier.detail}</p>
                  </div>
                  {tier.active && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${tier.color}20`, color: tier.color }}>You</span>}
                </div>
              ))}
            </div>

            <div className="card p-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted)", fontFamily: "'Syne',sans-serif" }}>
                Progress
              </h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: "var(--muted)" }}>To Unlimited</span>
                <span className="text-sm font-bold" style={{ color: "var(--accent3)", fontFamily: "'Syne',sans-serif" }}>{totalFriends}/10</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface2)" }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalFriends / 10) * 100, 100)}%`, background: "linear-gradient(90deg,#7c6dff,#6dffcc)" }} />
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                {totalFriends >= 10 ? "🎉 Unlimited posts unlocked!" : `Need ${10 - totalFriends} more friends`}
              </p>
            </div>
          </div>

          {/* Right: Friends list + suggestions */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* My friends */}
            {myFriends.length > 0 && (
              <div className="card p-5">
                <h2 className="text-sm font-bold mb-4" style={{ fontFamily: "'Syne',sans-serif" }}>
                  My Friends ({myFriends.length})
                </h2>
                <div className="flex flex-col gap-3">
                  {myFriends.map((friend) => (
                    <div key={friend.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ background: ag(friend.id), fontFamily: "'Syne',sans-serif" }}>
                        {friend.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ fontFamily: "'Syne',sans-serif" }}>{friend.name}</p>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>@{friend.handle} · {friend.friendIds.length} friends</p>
                      </div>
                      <button onClick={() => removeFriend(friend.id)}
                        className="btn-ghost text-xs px-3 py-1.5"
                        style={{ color: "#ff6d8a", borderColor: "rgba(255,109,138,0.3)" }}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            <div className="card p-5">
              <h2 className="text-sm font-bold mb-4" style={{ fontFamily: "'Syne',sans-serif" }}>
                People You May Know ({suggestions.length})
              </h2>
              {suggestions.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
                  🎉 You are friends with everyone!
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {suggestions.map((person) => (
                    <div key={person.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ background: ag(person.id), fontFamily: "'Syne',sans-serif" }}>
                        {person.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ fontFamily: "'Syne',sans-serif" }}>{person.name}</p>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>@{person.handle} · {person.bio || "PublicSpace member"}</p>
                      </div>
                      <button onClick={() => addFriend(person.id)} className="btn-primary text-xs px-4 py-1.5">
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}