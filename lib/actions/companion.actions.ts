'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();

  if (!author) {
    throw new Error("User not authenticated");
  }

  const supabase = createSupabaseClient();

  const payload = { ...formData, author };

  console.log("🔧 Creating companion with data:", payload);

  const { data, error, status, statusText } = await supabase
    .from('companions')
    .insert(payload)
    .select();

  console.log("📥 Supabase response =>", {
    status,
    statusText,
    error,
    data,
  });

  if (error || !data || data.length === 0) {
    throw new Error(error?.message || "❌ Failed to create companion");
  }

  return data[0];
};
