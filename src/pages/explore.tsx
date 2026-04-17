import Head from "next/head";

const TRENDING_TAGS = ["#Community", "#Photography", "#Tech", "#Travel", "#Food", "#Music", "#Art", "#Sports"];

const EXPLORE_POSTS = [
  { id: 1, image: "https://picsum.photos/seed/a1/400/400", author: "Aisha K.", likes: 842 },
  { id: 2, image: "https://picsum.photos/seed/b2/400/400", author: "Zara H.", likes: 641 },
  { id: 3, image: "https://picsum.photos/seed/c3/400/400", author: "Bilal S.", likes: 521 },
  { id: 4, image: "https://picsum.photos/seed/d4/400/400", author: "Raza M.", likes: 389 },
  { id: 5, image: "https://picsum.photos/seed/e5/400/400", author: "Fatima A.", likes: 298 },
  { id: 6, image: "https://picsum.photos/seed/f6/400/400", author: "Omar K.", likes: 215 },
  { id: 7, image: "https://picsum.photos/seed/g7/400/400", author: "Hina B.", likes: 187 },
  { id: 8, image: "https://picsum.photos/seed/h8/400/400", author: "Saad R.", likes: 143 },
  { id: 9, image: "https://picsum.photos/seed/i9/400/400", author: "Nadia T.", likes: 99 },
];

export default function ExplorePage() {
  return (
    <>
      <Head>
        <title>Explore — PublicSpace</title>
      </Head>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold gradient-text mb-2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Explore
          </h1>
          <p style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>
            Discover trending content and popular creators
          </p>
        </div>

        {/* Search Bar */}
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-8"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <span style={{ color: "var(--muted)" }}>🔍</span>
          <input
            placeholder="Search for posts, people, or tags..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--text)", fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>

        {/* Trending Tags Section */}
        <div className="mb-8">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--muted)", fontFamily: "'Syne', sans-serif" }}
          >
            Trending Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  color: "var(--accent)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Top Posts Feed Header */}
        <div className="mb-4">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--muted)", fontFamily: "'Syne', sans-serif" }}
          >
            🔥 Top Posts This Week
          </h2>
        </div>

        {/* Visual Grid of Posts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {EXPLORE_POSTS.map((post) => (
            <div
              key={post.id}
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
              style={{ aspectRatio: "1/1", background: "var(--surface2)" }}
            >
              <img
                src={post.image}
                alt={`Post by ${post.author}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay with details appearing on hover */}
              <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}
              >
                <div>
                  <p className="text-white font-semibold text-xs" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {post.author}
                  </p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>♥ {post.likes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}