"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WEDDING } from "@/lib/constants";
import { getDb, getBucket, serverTimestamp } from "@/lib/firebase/admin";

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

  // look up the guest by name in Firestore
  const guestsRef = getDb().collection("guests");
  const snapshot: any = await guestsRef.where("name", "==", guestName).limit(1).get();

  if (!snapshot.empty) {
    const doc: any = snapshot.docs[0];
    await doc.ref.update({
      attending,
      additional_guests: additionalGuests,
      attending_ceremony: attendingCeremony,
      attending_traditional: attendingTraditional,
      message,
      updated_at: serverTimestamp(),
    });

    return { success: true, updated: true };
  }

  await guestsRef.add({
    name: guestName,
    attending,
    additional_guests: additionalGuests,
    attending_ceremony: attendingCeremony,
    attending_traditional: attendingTraditional,
    message,
    created_at: serverTimestamp(),
  });

  return { success: true, updated: false };
}

export async function getMyRSVP() {
  const guestName = await getGuestName();
  if (!guestName) return null;

  const guestsRef = getDb().collection("guests");
  const snapshot: any = await guestsRef.where("name", "==", guestName).limit(1).get();
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
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

  const fileName = `${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const remotePath = `wedding-photos/${fileName}`;

  const fileRef = getBucket().file(remotePath);
  await fileRef.save(buffer, { metadata: { contentType: file.type } });
  // make public so guests can view it without auth
  await fileRef.makePublic();

  const publicUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${remotePath}`;

  await getDb().collection("photos").add({
    file_name: fileName,
    file_url: publicUrl,
    uploaded_by: guestName,
    caption,
    created_at: serverTimestamp(),
  });

  return { success: true, url: publicUrl };
}

export async function getPhotos() {
  const snapshot = await getDb()
    .collection("photos")
    .orderBy("created_at", "desc")
    .get();

  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}
