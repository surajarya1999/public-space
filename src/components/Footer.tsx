import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg,#7c6dff,#ff6d8a)" }}>PS</div>
            <span className="gradient-text text-lg" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800 }}>PublicSpace</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
            {["About","Privacy","Terms","Help"].map((l) => (
              <Link key={l} href="#" className="hover:text-accent transition-colors" style={{ color: "var(--muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
                {l}
              </Link>
            ))}
          </div>

          <div className="rounded-xl p-4 text-xs" style={{ background: "var(--surface2)", border: "1px solid var(--border)", fontFamily: "'DM Sans',sans-serif" }}>
            <p className="mb-2 uppercase tracking-widest font-semibold" style={{ color: "var(--muted)", fontSize: "0.6rem", fontFamily: "'Syne',sans-serif" }}>Posting Tiers</p>
            {[
              { dot: "#ff6d8a", label: "0 friends", limit: "Cannot post" },
              { dot: "#ffd166", label: "1 friend", limit: "1/day" },
              { dot: "#7c6dff", label: "2 friends", limit: "2/day" },
              { dot: "#6dffcc", label: "10+ friends", limit: "Unlimited ∞" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.dot }} />
                <span style={{ color: "var(--muted)" }}>{t.label}</span>
                <span className="ml-auto font-semibold" style={{ color: "var(--text)" }}>{t.limit}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-4 text-center text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--muted)" }}>
          © {new Date().getFullYear()} PublicSpace. Community first. 🌐
        </div>
      </div>
    </footer>
  );
}
