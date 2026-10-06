"use server";

import { supabase } from "@/lib/supabase/server";

export async function addMessage(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  const { error } = await supabase
    .from("messages")
    .insert({
      name,
      email,
      message,
    });

  if (error) {
    console.error("Supabase error:", error);

    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}