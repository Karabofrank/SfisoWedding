import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WEDDING } from "@/lib/constants";
import { WeddingNav } from "@/components/wedding-nav";

export default async function WeddingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const guestName = cookieStore.get(WEDDING.cookieName)?.value;

  if (!guestName) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <WeddingNav guestName={guestName} />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-secondary py-8 text-center">
        <p className="font-serif text-2xl text-primary">
          {WEDDING.couple.groom} & {WEDDING.couple.bride}
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          25th & 26th April 2026
        </p>
      </footer>
    </div>
  );
}
