// src/pages/api/upload.ts
// Signed Cloudinary upload using API Key + Secret

import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY     = process.env.CLOUDINARY_API_KEY!;
const API_SECRET  = process.env.CLOUDINARY_API_SECRET!;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "60mb",
    },
  },
};

function generateSignature(params: Record<string, string>): string {
  // Sort keys alphabetically, join as key=value pairs, append secret
  const str =
    Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&") + API_SECRET;

  return crypto.createHash("sha256").update(str).digest("hex");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sirf POST allowed hai" });
  }

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return res.status(500).json({
      error: ".env.local mein Cloudinary credentials set karo",
    });
  }

  const { file, resourceType = "image" } = req.body as {
    file: string;
    resourceType: string;
  };

  if (!file) {
    return res.status(400).json({ error: "File missing hai" });
  }

  try {
    const timestamp = String(Math.round(Date.now() / 1000));
    const folder = "publicspace";

    const paramsToSign: Record<string, string> = {
      folder,
      timestamp,
    };

    const signature = generateSignature(paramsToSign);

    // Build form data for Cloudinary
    const formData = new URLSearchParams();
    formData.append("file", file);
    formData.append("api_key", API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary error:", data);
      return res.status(400).json({
        error: data.error?.message || "Cloudinary upload fail hua",
      });
    }

    return res.status(200).json({
      url: data.secure_url,
      publicId: data.public_id,
      resourceType: data.resource_type,
      width: data.width,
      height: data.height,
      duration: data.duration,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
