import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WEDDING } from "@/lib/constants";
import { LoginForm } from "@/components/login-form";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const guest = cookieStore.get(WEDDING.cookieName)?.value;

  if (guest) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${WEDDING.photos.hero})` }}
      >
        <div className="absolute inset-0 bg-navy/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 py-12 text-center max-w-lg w-full">
        {/* Couple names */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-cream/80 font-sans text-sm tracking-[0.3em] uppercase">
            Together with their families
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-cream leading-tight text-balance">
            {WEDDING.couple.groom}
            <span className="block text-rose-gold text-3xl md:text-4xl my-2 italic">
              {"& "}
            </span>
            {WEDDING.couple.bride}
          </h1>
          <p className="text-cream/80 font-sans text-sm tracking-[0.3em] uppercase mt-2">
            Request the pleasure of your company
          </p>
        </div>

        {/* Date */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-16 h-px bg-rose-gold" />
          <p className="text-cream font-serif text-xl md:text-2xl mt-3">
            25th & 26th April 2026
          </p>
          <div className="w-16 h-px bg-rose-gold mt-3" />
        </div>

        {/* Login form */}
        <LoginForm />
      </div>
    </main>
  );
}
