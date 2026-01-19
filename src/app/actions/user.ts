"use server";

import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File;
    const currentImageUrl = formData.get("currentImageUrl") as string;

    try {
        let imageUrl = currentImageUrl || null;

        // Only process image if a file was actually uploaded
        if (imageFile && typeof imageFile === 'object' && imageFile.size > 0) {
            // Delete old photo if exists and is from blob
            if (currentImageUrl && currentImageUrl.includes("public.blob.vercel-storage.com")) {
                try {
                    await del(currentImageUrl);
                } catch (e) {
                    console.error("Failed to delete old image:", e);
                }
            }

            // Upload new photo
            const blob = await put(`profiles/${session.user.id}-${Date.now()}-${imageFile.name}`, imageFile, {
                access: "public",
            });
            imageUrl = blob.url;
        }

        await sql`
      UPDATE users 
      SET name = ${name}, image_url = ${imageUrl}
      WHERE id = ${parseInt(session.user.id)}
    `;

        revalidatePath("/dashboard");
        return { success: true, imageUrl };
    } catch (error) {
        console.error("Update profile error:", error);
        return { error: "Failed to update profile" };
    }
}
