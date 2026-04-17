"use client";
import { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/router";

const MAX_FILE_SIZE_MB = 50;
type UploadState = "idle" | "reading" | "uploading" | "done" | "error";

interface MediaPreview {
  localUrl: string;
  cloudUrl?: string;
  type: "image" | "video";
  name: string;
  sizeMB: number;
}

export default function PostComposer() {
  const { currentUser, addPost, getPostingInfo } = useApp();
  const router = useRouter();

  const [content, setContent] = useState("");
  const [media, setMedia] = useState<MediaPreview | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) {
    return (
      <div className="card p-6 text-center">
        <p className="text-2xl mb-2">👋</p>
        <p className="text-sm mb-3" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
          Please login to start posting.
        </p>
        <button onClick={() => router.push("/auth")} className="btn-primary text-sm px-6 py-2">
          Login / Register →
        </button>
      </div>
    );
  }

  const info = getPostingInfo();
  const bs = !info.canPost
    ? { color: "#ff6d8a", bg: "rgba(255,109,138,0.1)", border: "rgba(255,109,138,0.3)" }
    : info.remaining === "unlimited"
    ? { color: "#6dffcc", bg: "rgba(109,255,204,0.1)", border: "rgba(109,255,204,0.3)" }
    : { color: "#7c6dff", bg: "rgba(124,109,255,0.1)", border: "rgba(124,109,255,0.3)" };

  function readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function uploadToCloudinary(dataUrl: string, type: "image" | "video"): Promise<string> {
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((p) => Math.min(p + 8, 85));
    }, 300);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: dataUrl, resourceType: type }),
      });
      clearInterval(interval);
      setUploadProgress(100);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      return data.url;
    } catch (err) {
      clearInterval(interval);
      throw err;
    }
  }

  async function handleFile(file: File) {
    setError("");
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      setError("Please select an image (JPG, PNG, GIF, WEBP) or a video (MP4, MOV, WEBM).");
      return;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      setError(`File is too large (${sizeMB.toFixed(1)}MB). Max ${MAX_FILE_SIZE_MB}MB allowed.`);
      return;
    }
    const localUrl = URL.createObjectURL(file);
    const mediaType: "image" | "video" = isImage ? "image" : "video";
    setMedia({ localUrl, type: mediaType, name: file.name, sizeMB });
    setUploadState("reading");
    setUploadProgress(0);
    try {
      const dataUrl = await readAsDataUrl(file);
      setUploadState("uploading");
      const cloudUrl = await uploadToCloudinary(dataUrl, mediaType);
      setMedia((prev) => prev ? { ...prev, cloudUrl } : prev);
      setUploadState("done");
    } catch (err: any) {
      setUploadState("error");
      setError(err.message || "Upload failed. Please try again.");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function removeMedia() {
    if (media?.localUrl) URL.revokeObjectURL(media.localUrl);
    setMedia(null);
    setUploadState("idle");
    setUploadProgress(0);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() && !media) return;
    if (uploadState === "uploading" || uploadState === "reading") {
      setError("Please wait — media is still uploading...");
      return;
    }
    setError("");
    const mediaUrl = media?.cloudUrl || media?.localUrl;
    const err = addPost(content.trim() || " ", mediaUrl, media?.type);
    if (err) { setError(err); return; }
    setContent("");
    removeMedia();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  }

  const isUploading = uploadState === "reading" || uploadState === "uploading";

  return (
    <div className="card p-5" style={{ borderColor: info.canPost ? "var(--border)" : "rgba(255,109,138,0.25)" }}>

      {/* User header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold"
          style={{ background: "linear-gradient(135deg,#7c6dff,#ff6d8a)", fontFamily: "'Syne',sans-serif" }}>
          {currentUser.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm" style={{ fontFamily: "'Syne',sans-serif" }}>{currentUser.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ color: bs.color, background: bs.bg, border: `1px solid ${bs.border}` }}>
              {info.remaining === "unlimited" ? "∞ Unlimited" : info.canPost ? `${info.remaining} posts left` : "🔒 Limit Reached"}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: info.canPost ? "var(--accent3)" : "#ff6d8a", fontFamily: "'DM Sans',sans-serif" }}>
            {info.reason}
          </p>
        </div>
      </div>

      {/* Success */}
      {success && (
        <div className="mb-3 px-4 py-2 rounded-xl text-sm text-center"
          style={{ background: "rgba(109,255,204,0.1)", border: "1px solid rgba(109,255,204,0.3)", color: "var(--accent3)", fontFamily: "'DM Sans',sans-serif" }}>
          ✅ Posted successfully and saved to Cloudinary!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Textarea */}
        <textarea value={content} onChange={(e) => setContent(e.target.value)}
          disabled={!info.canPost} rows={3}
          placeholder={info.canPost ? "What's on your mind? Type here or add media below..." : "Limit reached — come back tomorrow or add more friends!"}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
          style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "'DM Sans',sans-serif", opacity: info.canPost ? 1 : 0.5 }}
          onFocus={(e) => { if (info.canPost) e.target.style.borderColor = "var(--accent)"; }}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />

        {/* Upload zone */}
        {info.canPost && !media && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 rounded-2xl cursor-pointer transition-all select-none"
            style={{
              border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
              background: dragging ? "rgba(124,109,255,0.08)" : "var(--surface2)",
              padding: "24px 16px",
            }}
          >
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: "rgba(124,109,255,0.15)", border: "1px solid rgba(124,109,255,0.25)" }}>🖼️</div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: "rgba(255,109,138,0.15)", border: "1px solid rgba(255,109,138,0.25)" }}>🎬</div>
            </div>
            <p className="text-center font-bold text-sm mb-1" style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
              📱 Upload Photo / Video from Gallery
            </p>
            <p className="text-center text-xs" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
              Tap here → your gallery will open • Saves to Cloudinary
            </p>
            <p className="text-center text-xs mt-1" style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif", opacity: 0.6 }}>
              JPG · PNG · GIF · WEBP · MP4 · MOV · WEBM — max 50MB
            </p>
          </div>
        )}

        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleInputChange} />

        {/* Media preview */}
        {media && (
          <div className="mt-3 rounded-xl overflow-hidden relative" style={{ background: "#000" }}>
            {media.type === "video" ? (
              <video src={media.localUrl} controls className="w-full rounded-xl" style={{ maxHeight: 340, display: "block" }} />
            ) : (
              <img src={media.localUrl} alt="preview" className="w-full object-cover rounded-xl" style={{ maxHeight: 340, display: "block" }} />
            )}

            {/* Uploading overlay */}
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl"
                style={{ background: "rgba(0,0,0,0.65)" }}>
                <div className="w-12 h-12 rounded-full border-4 border-t-transparent mb-3"
                  style={{ borderColor: "var(--accent) var(--accent) transparent transparent", animation: "spin 0.8s linear infinite" }} />
                <p className="text-white text-sm font-semibold mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>
                  {uploadState === "reading" ? "Reading file..." : "Uploading to Cloudinary..."}
                </p>
                <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%`, background: "var(--accent)" }} />
                </div>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{uploadProgress}%</p>
              </div>
            )}

            {/* Done badge */}
            {uploadState === "done" && (
              <div className="absolute top-2 left-2 px-2 py-1 rounded-lg"
                style={{ background: "rgba(109,255,204,0.2)", border: "1px solid rgba(109,255,204,0.4)" }}>
                <span className="text-xs" style={{ color: "var(--accent3)" }}>☁️ Saved to Cloudinary ✓</span>
              </div>
            )}

            {/* Error badge */}
            {uploadState === "error" && (
              <div className="absolute top-2 left-2 px-2 py-1 rounded-lg"
                style={{ background: "rgba(255,109,138,0.2)", border: "1px solid rgba(255,109,138,0.4)" }}>
                <span className="text-xs" style={{ color: "#ff6d8a" }}>⚠️ Upload failed</span>
              </div>
            )}

            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2"
              style={{ background: "linear-gradient(transparent,rgba(0,0,0,0.7))" }}>
              <div className="flex items-center gap-2">
                <span>{media.type === "image" ? "🖼️" : "🎬"}</span>
                <span className="text-xs text-white truncate" style={{ maxWidth: 160, fontFamily: "'DM Sans',sans-serif" }}>{media.name}</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{media.sizeMB.toFixed(1)}MB</span>
              </div>
              <div className="flex items-center gap-2">
                {!isUploading && (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="text-xs px-2 py-1 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>
                    Change
                  </button>
                )}
                <button type="button" onClick={removeMedia}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "rgba(255,109,138,0.85)" }}>✕</button>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-2 text-xs px-3 py-2 rounded-lg"
            style={{ background: "rgba(255,109,138,0.1)", color: "#ff6d8a", fontFamily: "'DM Sans',sans-serif" }}>
            ⚠️ {error}
          </p>
        )}

        {/* Bottom bar */}
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
          <button type="button" disabled={!info.canPost}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              color: media ? "var(--accent)" : "var(--muted)",
              background: media ? "rgba(124,109,255,0.1)" : "transparent",
              border: `1px solid ${media ? "rgba(124,109,255,0.3)" : "transparent"}`,
              opacity: info.canPost ? 1 : 0.4,
              fontFamily: "'DM Sans',sans-serif",
            }}>
            {media
              ? isUploading ? "⏳ Uploading..."
              : uploadState === "done" ? `${media.type === "image" ? "🖼️" : "🎬"} Cloudinary ✓`
              : `${media.type === "image" ? "🖼️" : "🎬"} Added`
              : "🖼️🎬 Photo / Video"}
          </button>

          <button type="submit" className="btn-primary text-sm px-6 py-2"
            disabled={!info.canPost || (!content.trim() && !media) || isUploading}>
            {isUploading ? "Wait for upload..." : "Publish →"}
          </button>
        </div>
      </form>

      {!info.canPost && currentUser.friendIds.length === 0 && (
        <div className="mt-4 p-3 rounded-xl text-xs"
          style={{ background: "rgba(255,109,138,0.06)", border: "1px solid rgba(255,109,138,0.2)" }}>
          <p className="font-semibold mb-1" style={{ color: "#ff6d8a", fontFamily: "'Syne',sans-serif" }}>🚀 Unlock Posting</p>
          <p style={{ color: "var(--muted)", fontFamily: "'DM Sans',sans-serif" }}>
            Go to the <a href="/friends" style={{ color: "var(--accent)" }}>Friends page</a> and make your first friend!
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}