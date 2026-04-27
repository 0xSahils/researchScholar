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

    // Ensure bucket exists or we just use public 'blog-images'
    // You should create a bucket named 'blog-images' in your Supabase dashboard and set it to public
    const { data: uploadData, error: uploadError } = await db.storage
      .from("blog-images")
      .upload(fileName, buffer, {
        contentType: type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = db.storage.from("blog-images").getPublicUrl(uploadData.path);

    return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Image upload exception:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
