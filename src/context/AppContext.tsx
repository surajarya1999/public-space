import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string; // initials
  bio: string;
  friendIds: string[];
  postsToday: number;
  lastPostDate: string; // YYYY-MM-DD
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorFriendCount: number;
  content: string;
  imageUrl?: string;     // seed post external URL
  mediaUrl?: string;     // Cloudinary URL (uploaded files)
  mediaType?: "image" | "video";
  likedBy: string[];
  comments: Comment[];
  shares: number;
  createdAt: string;
}

interface AppContextType {
  // Auth
  currentUser: User | null;
  allUsers: User[];
  login: (handle: string, password: string) => string | null; // returns error or null
  register: (name: string, handle: string, password: string) => string | null;
  logout: () => void;
  updateUser: (updated: User) => void;

  // Posts
  posts: Post[];
  addPost: (content: string, mediaDataUrl?: string, mediaType?: "image" | "video") => string | null;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  sharePost: (postId: string) => void;
  getPostingInfo: () => { canPost: boolean; reason: string; remaining: number | "unlimited" };

  // Friends
  addFriend: (targetId: string) => void;
  removeFriend: (targetId: string) => void;
  isFriend: (targetId: string) => boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function today() {
  return new Date().toISOString().slice(0, 10);
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function getPostLimit(friendCount: number): number | "unlimited" | "blocked" {
  if (friendCount === 0) return "blocked";
  if (friendCount === 1) return 1;
  if (friendCount === 2) return 2;
  if (friendCount > 10) return "unlimited";
  return friendCount; // 3–10: equal to friend count
}

// ─── Seed data ───────────────────────────────────────────────────────────────

const SEED_USERS: User[] = [
  { id: "u1", name: "Aisha Khan", handle: "aishak", avatar: "AK", bio: "Photographer & traveler 📸", friendIds: ["u2", "u3"], postsToday: 0, lastPostDate: today() },
  { id: "u2", name: "Bilal Shah", handle: "bilals", avatar: "BS", bio: "Tech enthusiast & chai lover ☕", friendIds: ["u1"], postsToday: 0, lastPostDate: today() },
  { id: "u3", name: "Zara Hussain", handle: "zarah", avatar: "ZH", bio: "Designer | Building things that matter", friendIds: ["u1", "u2", "u4", "u5", "u6", "u7", "u8", "u9", "u10", "u11", "u12"], postsToday: 0, lastPostDate: today() },
  { id: "u4", name: "Omar Farooq", handle: "omarf", avatar: "OF", bio: "Just here to vibe 🎵", friendIds: ["u3"], postsToday: 0, lastPostDate: today() },
  { id: "u5", name: "Fatima Ahmed", handle: "fatimaa", avatar: "FA", bio: "Student | Coffee addict", friendIds: ["u3"], postsToday: 0, lastPostDate: today() },
  { id: "u6", name: "Hassan Ali", handle: "hassana", avatar: "HA", bio: "Developer by day, gamer by night", friendIds: ["u3"], postsToday: 0, lastPostDate: today() },
  { id: "u7", name: "Nadia Tariq", handle: "nadiat", avatar: "NT", bio: "Foodie 🍜 | Wanderer", friendIds: ["u3"], postsToday: 0, lastPostDate: today() },
  { id: "u8", name: "Saad Rauf", handle: "saadr", avatar: "SR", bio: "Startup founder | Building in public", friendIds: ["u3"], postsToday: 0, lastPostDate: today() },
  { id: "u9", name: "Hina Baig", handle: "hinab", avatar: "HB", bio: "Artist & creative soul 🎨", friendIds: ["u3"], postsToday: 0, lastPostDate: today() },
  { id: "u10", name: "Kamran Javed", handle: "kamranj", avatar: "KJ", bio: "Sports freak | Weekend hiker", friendIds: ["u3"], postsToday: 0, lastPostDate: today() },
  { id: "u11", name: "Rabia Noor", handle: "rabianr", avatar: "RN", bio: "Books, bytes & beyond 📚", friendIds: ["u3"], postsToday: 0, lastPostDate: today() },
  { id: "u12", name: "Usman Ghani", handle: "usmang", avatar: "UG", bio: "Minimalist. Builder. Dreamer.", friendIds: ["u3"], postsToday: 0, lastPostDate: today() },
];

const SEED_POSTS: Post[] = [
  {
    id: "p1", authorId: "u3", authorName: "Zara Hussain", authorAvatar: "ZH", authorFriendCount: 11,
    content: "Golden hour in Lahore hits different 🌅 Couldn't resist sharing this beauty. Some moments are just meant to be captured forever.",
    imageUrl: "https://picsum.photos/seed/lahore1/800/450",
    likedBy: ["u1", "u2", "u4"], comments: [
      { id: "c1", authorId: "u1", authorName: "Aisha Khan", authorAvatar: "AK", text: "Absolutely stunning! 😍", createdAt: "2025-03-13T08:00:00Z" },
      { id: "c2", authorId: "u2", authorName: "Bilal Shah", authorAvatar: "BS", text: "Lahore ki shaan! 🔥", createdAt: "2025-03-13T08:05:00Z" },
    ], shares: 12, createdAt: "2025-03-13T07:30:00Z",
  },
  {
    id: "p2", authorId: "u1", authorName: "Aisha Khan", authorAvatar: "AK", authorFriendCount: 2,
    content: "Just hit 2 friends on PublicSpace which means 2 posts a day now! 🎉 This reward system is so motivating. Who else is grinding up the tiers?",
    likedBy: ["u3", "u4", "u5", "u6"], comments: [
      { id: "c3", authorId: "u3", authorName: "Zara Hussain", authorAvatar: "ZH", text: "Keep going! 10+ friends = unlimited 🚀", createdAt: "2025-03-13T09:00:00Z" },
    ], shares: 3, createdAt: "2025-03-13T08:45:00Z",
  },
  {
    id: "p3", authorId: "u8", authorName: "Saad Rauf", authorAvatar: "SR", authorFriendCount: 11,
    content: "Week 4 of building in public 📊 Revenue up 23%, churn down 8%. Community feedback has been invaluable. Thank you all for the support and honest reviews — this platform is special.",
    likedBy: ["u1", "u2", "u3", "u7", "u9"], comments: [], shares: 19, createdAt: "2025-03-13T06:00:00Z",
  },
  {
    id: "p4", authorId: "u9", authorName: "Hina Baig", authorAvatar: "HB", authorFriendCount: 11,
    content: "New artwork finished! 🎨 This one took 3 weeks — every brushstroke was intentional. Art is patience.",
    imageUrl: "https://picsum.photos/seed/art99/800/450",
    likedBy: ["u3", "u5", "u6", "u10", "u11", "u12"], comments: [
      { id: "c4", authorId: "u5", authorName: "Fatima Ahmed", authorAvatar: "FA", text: "This is GORGEOUS 😭✨", createdAt: "2025-03-13T07:00:00Z" },
      { id: "c5", authorId: "u7", authorName: "Nadia Tariq", authorAvatar: "NT", text: "Please sell prints!", createdAt: "2025-03-13T07:10:00Z" },
    ], shares: 31, createdAt: "2025-03-13T05:00:00Z",
  },
];

const SEED_PASSWORDS: Record<string, string> = {
  aishak: "demo123", bilals: "demo123", zarah: "demo123",
  omarf: "demo123", fatimaa: "demo123", hassana: "demo123",
  nadiat: "demo123", saadr: "demo123", hinab: "demo123",
  kamranj: "demo123", rabianr: "demo123", usmang: "demo123",
};

// ─── Context ─────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [passwords, setPasswords] = useState<Record<string, string>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("ps_users");
    const storedPosts = localStorage.getItem("ps_posts");
    const storedPasswords = localStorage.getItem("ps_passwords");
    const storedCurrentUser = localStorage.getItem("ps_currentUser");

    const users = storedUsers ? JSON.parse(storedUsers) : SEED_USERS;
    const postsData = storedPosts ? JSON.parse(storedPosts) : SEED_POSTS;
    const pwds = storedPasswords ? JSON.parse(storedPasswords) : SEED_PASSWORDS;

    setAllUsers(users);
    setPosts(postsData);
    setPasswords(pwds);

    if (storedCurrentUser) {
      const cu = JSON.parse(storedCurrentUser);
      // refresh from allUsers
      const fresh = users.find((u: User) => u.id === cu.id);
      if (fresh) setCurrentUser(fresh);
    }

    // Initialize seed data if first time
    if (!storedUsers) localStorage.setItem("ps_users", JSON.stringify(SEED_USERS));
    if (!storedPosts) localStorage.setItem("ps_posts", JSON.stringify(SEED_POSTS));
    if (!storedPasswords) localStorage.setItem("ps_passwords", JSON.stringify(SEED_PASSWORDS));
  }, []);

  function saveUsers(users: User[]) {
    setAllUsers(users);
    localStorage.setItem("ps_users", JSON.stringify(users));
  }

  function savePosts(p: Post[]) {
    setPosts(p);
    localStorage.setItem("ps_posts", JSON.stringify(p));
  }

  function login(handle: string, password: string): string | null {
    const h = handle.trim().toLowerCase();
    const user = allUsers.find((u) => u.handle === h);
    if (!user) return "Account nahi mila. Pehle register karo.";
    if (passwords[h] !== password) return "Password galat hai.";

    // Reset postsToday if new day
    let u = { ...user };
    if (u.lastPostDate !== today()) {
      u = { ...u, postsToday: 0, lastPostDate: today() };
      const updated = allUsers.map((x) => (x.id === u.id ? u : x));
      saveUsers(updated);
    }

    setCurrentUser(u);
    localStorage.setItem("ps_currentUser", JSON.stringify(u));
    return null;
  }

  function register(name: string, handle: string, password: string): string | null {
    const h = handle.trim().toLowerCase().replace(/\s+/g, "");
    if (!name.trim()) return "Naam daalo.";
    if (h.length < 3) return "Handle kam se kam 3 characters ka hona chahiye.";
    if (password.length < 6) return "Password kam se kam 6 characters ka hona chahiye.";
    if (allUsers.find((u) => u.handle === h)) return "Yeh handle pehle se liya hua hai.";

    const newUser: User = {
      id: uid(), name: name.trim(), handle: h,
      avatar: initials(name), bio: "",
      friendIds: [], postsToday: 0, lastPostDate: today(),
    };

    const updatedUsers = [...allUsers, newUser];
    const updatedPasswords = { ...passwords, [h]: password };

    saveUsers(updatedUsers);
    setPasswords(updatedPasswords);
    localStorage.setItem("ps_passwords", JSON.stringify(updatedPasswords));

    setCurrentUser(newUser);
    localStorage.setItem("ps_currentUser", JSON.stringify(newUser));
    return null;
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem("ps_currentUser");
  }

  function updateUser(updated: User) {
    const updatedUsers = allUsers.map((u) => (u.id === updated.id ? updated : u));
    saveUsers(updatedUsers);
    setCurrentUser(updated);
    localStorage.setItem("ps_currentUser", JSON.stringify(updated));
  }

  function getPostingInfo() {
    if (!currentUser) return { canPost: false, reason: "Login karo pehle", remaining: 0 };

    // Reset if new day
    let user = currentUser;
    if (user.lastPostDate !== today()) {
      user = { ...user, postsToday: 0, lastPostDate: today() };
      updateUser(user);
    }

    const limit = getPostLimit(user.friendIds.length);

    if (limit === "blocked") {
      return { canPost: false, reason: "Kam se kam 1 friend banao posting ke liye", remaining: 0 };
    }
    if (limit === "unlimited") {
      return { canPost: true, reason: "Unlimited posts ✦", remaining: "unlimited" as const };
    }
    const remaining = Math.max(0, limit - user.postsToday);
    return {
      canPost: remaining > 0,
      reason: remaining > 0
        ? `Aaj ${remaining} post${remaining > 1 ? "s" : ""} bachi hain`
        : "Aaj ka limit khatam — zyada friends banao!",
      remaining,
    };
  }

  function addPost(content: string, mediaDataUrl?: string, mediaType?: "image" | "video"): string | null {
    if (!currentUser) return "Pehle login karo.";
    const info = getPostingInfo();
    if (!info.canPost) return info.reason;

    const newPost: Post = {
      id: uid(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorFriendCount: currentUser.friendIds.length,
      content,
      mediaUrl: mediaDataUrl,
      mediaType,
      likedBy: [],
      comments: [],
      shares: 0,
      createdAt: new Date().toISOString(),
    };

    savePosts([newPost, ...posts]);

    const updatedUser = {
      ...currentUser,
      postsToday: currentUser.postsToday + 1,
      lastPostDate: today(),
    };
    updateUser(updatedUser);
    return null;
  }

  function toggleLike(postId: string) {
    if (!currentUser) return;
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      const liked = p.likedBy.includes(currentUser.id);
      return {
        ...p,
        likedBy: liked
          ? p.likedBy.filter((id) => id !== currentUser.id)
          : [...p.likedBy, currentUser.id],
      };
    });
    savePosts(updated);
  }

  function addComment(postId: string, text: string) {
    if (!currentUser || !text.trim()) return;
    const comment: Comment = {
      id: uid(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = posts.map((p) =>
      p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
    );
    savePosts(updated);
  }

  function sharePost(postId: string) {
    const updated = posts.map((p) =>
      p.id === postId ? { ...p, shares: p.shares + 1 } : p
    );
    savePosts(updated);
  }

  function addFriend(targetId: string) {
    if (!currentUser) return;
    if (currentUser.friendIds.includes(targetId)) return;
    const updatedUser = { ...currentUser, friendIds: [...currentUser.friendIds, targetId] };
    updateUser(updatedUser);

    // Also make the other user add back (mutual)
    const target = allUsers.find((u) => u.id === targetId);
    if (target && !target.friendIds.includes(currentUser.id)) {
      const updatedTarget = { ...target, friendIds: [...target.friendIds, currentUser.id] };
      const updatedUsers = allUsers.map((u) =>
        u.id === updatedUser.id ? updatedUser : u.id === updatedTarget.id ? updatedTarget : u
      );
      saveUsers(updatedUsers);
      setCurrentUser(updatedUser);
      localStorage.setItem("ps_currentUser", JSON.stringify(updatedUser));
    }
  }

  function removeFriend(targetId: string) {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, friendIds: currentUser.friendIds.filter((id) => id !== targetId) };
    updateUser(updatedUser);
  }

  function isFriend(targetId: string) {
    return currentUser?.friendIds.includes(targetId) ?? false;
  }

  return (
    <AppContext.Provider value={{
      currentUser, allUsers, login, register, logout, updateUser,
      posts, addPost, toggleLike, addComment, sharePost, getPostingInfo,
      addFriend, removeFriend, isFriend,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
