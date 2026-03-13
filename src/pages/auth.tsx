import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useApp } from "@/context/AppContext";

export default function AuthPage() {
  const { login, register } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    let err: string | null = null;
    if (mode === "login") {
      err = login(handle, password);
    } else {
      err = register(name, handle, password);
    }

    setLoading(false);
    if (err) { setError(err); return; }
    router.push("/");
  }

  const DEMO_ACCOUNTS = [
    { handle: "zarah", label: "Zara (10+ friends = Unlimited)" },
    { handle: "aishak", label: "Aisha (2 friends = 2/day)" },
    { handle: "bilals", label: "Bilal (1 friend = 1/day)" },
  ];

  return (
    <>
      <Head><title>{mode === "login" ? "Login" : "Register"} — PublicSpace</title></Head>

      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
              style={{ background: "linear-gradient(135deg,#7c6dff,#ff6d8a)", fontFamily: "'Syne',sans-serif" }}
            >
              PS
            </div>
            <h1 className="text-3xl font-bold gradient-text" style={{ fontFamily: "'Syne',sans-serif" }}>
              {mode === "login" ? "Wapas aao! 👋" : "Shuruaat karo ✦"}
            </h1>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
              {mode === "login" ? "Apne account mein login karo" : "PublicSpace community join karo"}
            </p>
          </div>

          {/* Demo accounts */}
          {mode === "login" && (
            <div className="mb-6 p-4 rounded-2xl" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted)", fontFamily: "'Syne',sans-serif" }}>
                ⚡ Demo Accounts (password: demo123)
              </p>
              <div className="flex flex-col gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.handle}
                    onClick={() => { setHandle(acc.handle); setPassword("demo123"); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs transition-all hover:scale-[1.01]"
                    style={{
                      background: handle === acc.handle ? "rgba(124,109,255,0.15)" : "var(--surface)",
                      border: `1px solid ${handle === acc.handle ? "rgba(124,109,255,0.4)" : "var(--border)"}`,
                      color: handle === acc.handle ? "var(--accent)" : "var(--muted)",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    <span className="font-semibold">@{acc.handle}</span>
                    <span style={{ color: "var(--muted)" }}>— {acc.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--muted)", fontFamily: "'Syne',sans-serif" }}>
                  Poora Naam
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jaise: Aisha Khan"
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "'DM Sans',sans-serif" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--muted)", fontFamily: "'Syne',sans-serif" }}>
                Handle / Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--muted)" }}>@</span>
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/\s/g, ""))}
                  placeholder="tumharahandle"
                  required
                  className="w-full rounded-xl pl-8 pr-4 py-3 text-sm outline-none"
                  style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "'DM Sans',sans-serif" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--muted)", fontFamily: "'Syne',sans-serif" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "login" ? "Apna password daalo" : "Kam se kam 6 characters"}
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "'DM Sans',sans-serif" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,109,138,0.1)", border: "1px solid rgba(255,109,138,0.3)", color: "#ff6d8a", fontFamily: "'DM Sans',sans-serif" }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-3 text-sm mt-1" disabled={loading}>
              {loading ? "Ruko..." : mode === "login" ? "Login Karo →" : "Account Banao →"}
            </button>

            <p className="text-center text-sm" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
              {mode === "login" ? "Pehli baar aaye ho? " : "Pehle se account hai? "}
              <button
                type="button"
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                className="font-semibold"
                style={{ color: "var(--accent)" }}
              >
                {mode === "login" ? "Register karo" : "Login karo"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
