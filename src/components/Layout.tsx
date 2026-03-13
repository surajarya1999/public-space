import Navbar from "./Navbar";
import Footer from "./Footer";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div
          className="orb opacity-10"
          style={{ width: 500, height: 500, background: "var(--accent)", top: -100, left: -100, animationDelay: "0s" }}
        />
        <div
          className="orb opacity-10"
          style={{ width: 400, height: 400, background: "var(--accent2)", bottom: -80, right: -80, animationDelay: "-5s" }}
        />
        <div
          className="orb opacity-[0.06]"
          style={{ width: 300, height: 300, background: "var(--accent3)", top: "45%", left: "40%", animationDelay: "-10s" }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
