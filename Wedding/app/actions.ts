"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WEDDING } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export async function loginWithInviteCode(formData: FormData) {
  const code = formData.get("inviteCode") as string;
  const name = (formData.get("guestName") as string)?.trim();

  if (!code || !name) {
    return { error: "Please enter both the invite code and your name." };
  }

  if (code !== WEDDING.inviteCode) {
    return { error: "Invalid invite code. Please check your invitation." };
  }

  const cookieStore = await cookies();
  cookieStore.set(WEDDING.cookieName, name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 90, // 90 days
    path: "/",
  });

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(WEDDING.cookieName);
  redirect("/");
}

export async function getGuestName(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(WEDDING.cookieName)?.value ?? null;
}

export async function submitRSVP(formData: FormData) {
  const guestName = await getGuestName();
  if (!guestName) {
    return { error: "You must be logged in to RSVP." };
  }

  const attending = formData.get("attending") === "yes";
  const additionalGuests = parseInt(formData.get("additionalGuests") as string) || 0;
  const attendingCeremony = formData.get("attendingCeremony") === "on";
  const attendingTraditional = formData.get("attendingTraditional") === "on";
  const message = (formData.get("message") as string)?.trim() || null;

  const supabase = await createClient();

  // Check if guest already RSVP'd
  const { data: existing } = await supabase
    .from("guests")
    .select("id")
    .eq("name", guestName)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("guests")
      .update({
        attending,
        additional_guests: additionalGuests,
        attending_ceremony: attendingCeremony,
        attending_traditional: attendingTraditional,
        message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      return { error: "Failed to update RSVP. Please try again." };
    }
    return { success: true, updated: true };
  }

  const { error } = await supabase.from("guests").insert({
    name: guestName,
    attending,
    additional_guests: additionalGuests,
    attending_ceremony: attendingCeremony,
    attending_traditional: attendingTraditional,
    message,
  });

  if (error) {
    return { error: "Failed to submit RSVP. Please try again." };
  }
  return { success: true, updated: false };
}

export async function getMyRSVP() {
  const guestName = await getGuestName();
  if (!guestName) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("guests")
    .select("*")
    .eq("name", guestName)
    .single();

  return data;
}

export async function uploadPhoto(formData: FormData) {
  const guestName = await getGuestName();
  if (!guestName) {
    return { error: "You must be logged in to upload photos." };
  }

  const file = formData.get("file") as File;
  const caption = (formData.get("caption") as string)?.trim() || null;

  if (!file || file.size === 0) {
    return { error: "Please select a file to upload." };
  }

  const supabase = await createClient();
  const fileName = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("wedding-photos")
    .upload(fileName, file);

  if (uploadError) {
    return { error: "Failed to upload photo. Please try again." };
  }

  const { data: urlData } = supabase.storage
    .from("wedding-photos")
    .getPublicUrl(fileName);

  const { error: dbError } = await supabase.from("photos").insert({
    file_name: fileName,
    file_url: urlData.publicUrl,
    uploaded_by: guestName,
    caption,
  });

  if (dbError) {
    return { error: "Photo uploaded but failed to save metadata." };
  }

  return { success: true, url: urlData.publicUrl };
}

export async function getPhotos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}
