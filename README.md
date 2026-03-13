# PublicSpace — Cloudinary Setup Guide

## 🚀 Run Karo
```bash
npm install && npm run dev
```

---

## ☁️ Cloudinary Setup (ZARURI — bina iske upload nahi hoga)

### Step 1 — Free Account
👉 https://cloudinary.com → "Sign Up For Free" → Email se register karo
(Free: 25GB storage + 25GB bandwidth/month, no credit card)

### Step 2 — Cloud Name Dhundo
Login → Dashboard → Top par likha hoga:
```
Cloud name: dxyz123abc   ← yeh copy karo
```

### Step 3 — Upload Preset Banao
1. Settings (gear icon) → Upload → "Upload presets" → "Add upload preset"
2. **Signing Mode = Unsigned** ← ZARURI
3. Preset name: `publicspace_upload`
4. Save karo → preset name copy karo

### Step 4 — .env.local File Banao
```bash
cp .env.local.example .env.local
```
File mein apni values daalo:
```
CLOUDINARY_CLOUD_NAME=tumhara_cloud_name
CLOUDINARY_UPLOAD_PRESET=publicspace_upload
```

### Step 5 — Restart
```bash
npm run dev
```
**Ab gallery se photo/video upload karo → Cloudinary par save hoga! ✅**

---

## Demo Accounts (password: demo123)
- `zarah` — Unlimited (10+ friends)
- `aishak` — 2/day
- `bilals` — 1/day

## Posting Tiers
| Friends | Posts |
|---------|-------|
| 0 | Cannot post |
| 1 | 1/day |
| 2 | 2/day |
| 10+ | Unlimited |
