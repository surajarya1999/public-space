import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useApp } from "@/context/AppContext";

const NAV_LINKS = [
  { href: "/", label: "Feed", icon: "⊞" },
  { href: "/explore", label: "Explore", icon: "◎" },
  { href: "/friends", label: "Friends", icon: "⟡" },
];

export default function Navbar() {
  const router = useRouter();
  const { currentUser, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/auth");
    setDropdownOpen(false);
  }

  return (
    <header className="glass sticky top-0 z-50 border-b" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg,#7c6dff,#ff6d8a)" }}>
            PS
          </div>
          <span className="font-syne font-800 text-xl gradient-text hidden sm:block"
            style={{ fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>
            PublicSpace
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive ? "var(--accent)" : "var(--muted)",
                  background: isActive ? "rgba(124,109,255,0.1)" : "transparent",
                  border: isActive ? "1px solid rgba(124,109,255,0.25)" : "1px solid transparent",
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                <span>{link.icon}</span>{link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2 py-1 rounded-xl transition-all hover:bg-white/5"
                style={{ border: "1px solid var(--border)" }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: "linear-gradient(135deg,#7c6dff,#ff6d8a)", fontFamily: "'Syne',sans-serif" }}>
                  {currentUser.avatar}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold leading-none" style={{ fontFamily: "'Syne',sans-serif" }}>{currentUser.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>@{currentUser.handle}</p>
                </div>
                <span className="text-xs" style={{ color: "var(--muted)" }}>▾</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-48 rounded-xl shadow-2xl z-50 overflow-hidden"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                    <p className="text-xs font-semibold" style={{ fontFamily: "'Syne',sans-serif" }}>{currentUser.name}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {currentUser.friendIds.length} friends · {currentUser.postsToday} posts aaj
                    </p>
                  </div>
                  <Link href="/profile" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm transition-all hover:bg-white/5"
                    style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
                    ◈ Profile
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm transition-all hover:bg-white/5 text-left"
                    style={{ color: "#ff6d8a", fontFamily: "'DM Sans',sans-serif" }}>
                    ← Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth" className="btn-primary text-sm px-4 py-2">
              Login →
            </Link>
          )}

          {/* Mobile hamburger */}
          <button className="md:hidden w-9 h-9 rounded-xl flex flex-col items-center justify-center gap-1"
            style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
            onClick={() => setMobileOpen(!mobileOpen)}>
            <span className="block w-4 h-0.5" style={{ background: "var(--muted)" }} />
            <span className="block w-4 h-0.5" style={{ background: "var(--muted)" }} />
            <span className="block w-4 h-0.5" style={{ background: "var(--muted)" }} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-1"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
              style={{ color: router.pathname === link.href ? "var(--accent)" : "var(--muted)" }}>
              <span>{link.icon}</span>{link.label}
            </Link>
          ))}
          {currentUser && (
            <button onClick={() => { handleLogout(); setMobileOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left"
              style={{ color: "#ff6d8a" }}>
              ← Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
