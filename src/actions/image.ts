"use server";

import { auth } from "@/core/auth";
import { createAdminClient } from "@/utils/supabase/server";

export const uploadImage = async (base64Image: string): Promise<string> => {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Authentication required");
    }

    if (!base64Image.startsWith("data:")) {
      return base64Image;
    }

    const supabase = await createAdminClient();

    const base64Response = await fetch(base64Image);
    const blob = await base64Response.blob();

    const fileExt = blob.type.split("/")[1] || "jpeg";
    const userId = session.user.id || "anonymous";
    const fileName = `${Date.now()}_${userId}.${fileExt}`;
    const filePath = `event-banners/${fileName}`;

    const { data, error } = await supabase.storage.from("meethub").upload(filePath, blob, {
      contentType: blob.type,
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Supabase storage error:", error);
      throw new Error(`Storage error: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("meethub").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error in uploadImage:", error);
    throw new Error(
      `Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
