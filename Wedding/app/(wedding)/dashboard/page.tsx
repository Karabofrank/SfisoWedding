import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { WEDDING } from "@/lib/constants";
import { Countdown } from "@/components/countdown";
import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Camera } from "lucide-react";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const guestName = cookieStore.get(WEDDING.cookieName)?.value ?? "Guest";

  const couplePhotos = [
    { src: WEDDING.photos.hero, alt: "Sifiso and Mapula at the waterfall" },
    { src: WEDDING.photos.couple1, alt: "Sifiso and Mapula posing together" },
    { src: WEDDING.photos.couple2, alt: "Sifiso and Mapula foreheads touching" },
    { src: WEDDING.photos.couple3, alt: "Sifiso and Mapula on garden path" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-10">
      {/* Welcome */}
      <section className="text-center flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-sm uppercase tracking-wider">
          Welcome, {guestName}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-primary text-balance">
          {WEDDING.couple.groom} & {WEDDING.couple.bride}
        </h1>
        <p className="text-muted-foreground max-w-md leading-relaxed">
          We are overjoyed to share our special day with you. Below you will
          find all the details for our celebration.
        </p>
      </section>

      {/* Countdown */}
      <section className="bg-card rounded-xl border border-border p-6 md:p-8 text-center flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          Counting down to the big day
        </p>
        <Countdown />
      </section>

      {/* Event Details */}
      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl text-primary text-center">
          Event Details
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <EventCard
            title={WEDDING.matrimonial.title}
            date={WEDDING.matrimonial.date}
            time={WEDDING.matrimonial.time}
            venue={WEDDING.matrimonial.venue}
            address={WEDDING.matrimonial.address}
            reception={WEDDING.matrimonial.reception}
            dressCode={WEDDING.matrimonial.dressCode}
          />
          <EventCard
            title={WEDDING.traditional.title}
            date={WEDDING.traditional.date}
            venue={WEDDING.traditional.venue}
            address={WEDDING.traditional.address}
            dressCode={WEDDING.traditional.dressCode}
          />
        </div>
      </section>

      {/* Couple Photos */}
      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl text-primary text-center">
          Our Story
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {couplePhotos.map((photo, i) => (
            <div
              key={i}
              className="relative aspect-[3/4] rounded-lg overflow-hidden"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-4">
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-5">
          <Link href="/rsvp">
            <CalendarDays className="h-4 w-4 mr-2" />
            RSVP Now
          </Link>
        </Button>
        <Button asChild variant="outline" className="px-8 py-5 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <Link href="/gallery">
            <Camera className="h-4 w-4 mr-2" />
            Photo Gallery
          </Link>
        </Button>
      </section>
    </div>
  );
}
