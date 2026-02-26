import { getGuestName, getMyRSVP } from "@/app/actions";
import { RSVPForm } from "@/components/rsvp-form";
import { redirect } from "next/navigation";

export default async function RSVPPage() {
  const guestName = await getGuestName();
  if (!guestName) redirect("/");

  const existingRsvp = await getMyRSVP();

  return (
    <div className="max-w-lg mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="text-center flex flex-col items-center gap-2">
        <h1 className="font-serif text-3xl md:text-4xl text-primary">
          RSVP
        </h1>
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
          Please let us know if you will be joining us for our celebration.
          We would love to have you there!
        </p>
      </div>

      <RSVPForm guestName={guestName} existingRsvp={existingRsvp} />
    </div>
  );
}
