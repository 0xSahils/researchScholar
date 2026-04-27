import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 5MB allowed." }, { status: 400 });
    }

    const { type } = file;
    if (!type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type. Only images allowed." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Create safe filename
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const db = createAdminClient();

    // Check if bucket exists, if not attempt to create it
    const { data: buckets, error: bucketsError } = await db.storage.listBuckets();
    if (!bucketsError) {
      const bucketExists = buckets.some((b) => b.name === "blog-images");
      if (!bucketExists) {
        // Attempt to create it publicly
        await db.storage.createBucket("blog-images", { public: true });
      }
    }

    const { data: uploadData, error: uploadError } = await db.storage
      .from("blog-images")
      .upload(fileName, buffer, {
        contentType: type,
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error details:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = db.storage.from("blog-images").getPublicUrl(uploadData.path);

    return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Image upload exception details:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
