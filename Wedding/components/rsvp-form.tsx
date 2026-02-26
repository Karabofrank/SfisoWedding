"use client";

import { useActionState, useState } from "react";
import { submitRSVP } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface RSVPData {
  id: string;
  name: string;
  attending: boolean | null;
  additional_guests: number;
  attending_ceremony: boolean;
  attending_traditional: boolean;
  message: string | null;
}

export function RSVPForm({
  guestName,
  existingRsvp,
}: {
  guestName: string;
  existingRsvp: RSVPData | null;
}) {
  const [attending, setAttending] = useState<string>(
    existingRsvp?.attending === true
      ? "yes"
      : existingRsvp?.attending === false
      ? "no"
      : ""
  );
  const [submitted, setSubmitted] = useState(false);

  const [state, formAction, isPending] = useActionState(
    async (
      _prev: { error?: string; success?: boolean; updated?: boolean } | null,
      formData: FormData
    ) => {
      const result = await submitRSVP(formData);
      if (result.success) {
        setSubmitted(true);
        toast.success(
          result.updated ? "RSVP updated successfully!" : "RSVP submitted successfully!"
        );
      }
      return result;
    },
    null
  );

  if (submitted && state?.success) {
    return (
      <Card className="border-border bg-card text-center">
        <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
          <CheckCircle2 className="h-12 w-12 text-sage" />
          <h3 className="font-serif text-2xl text-primary">
            {state.updated ? "RSVP Updated!" : "Thank You!"}
          </h3>
          <p className="text-muted-foreground max-w-sm">
            {attending === "yes"
              ? "We are looking forward to celebrating with you!"
              : "We are sorry you cannot make it. You will be missed!"}
          </p>
          <Button
            variant="outline"
            onClick={() => setSubmitted(false)}
            className="mt-2 border-primary text-primary"
          >
            Edit Response
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-primary">
          {existingRsvp ? "Update Your RSVP" : "RSVP"}
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Responding as <span className="font-medium text-card-foreground">{guestName}</span>
        </p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-5">
          {/* Attending */}
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-card-foreground mb-1">
              Will you be attending?
            </legend>
            <div className="flex gap-3">
              <label
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                  attending === "yes"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-accent/50"
                }`}
              >
                <input
                  type="radio"
                  name="attending"
                  value="yes"
                  checked={attending === "yes"}
                  onChange={() => setAttending("yes")}
                  className="sr-only"
                  required
                />
                <span className="text-sm font-medium">Joyfully Accept</span>
              </label>
              <label
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                  attending === "no"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-accent/50"
                }`}
              >
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  checked={attending === "no"}
                  onChange={() => setAttending("no")}
                  className="sr-only"
                />
                <span className="text-sm font-medium">Respectfully Decline</span>
              </label>
            </div>
          </fieldset>

          {attending === "yes" && (
            <>
              {/* Additional guests */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="additionalGuests" className="text-sm text-card-foreground">
                  Number of additional guests
                </Label>
                <Input
                  id="additionalGuests"
                  name="additionalGuests"
                  type="number"
                  min={0}
                  max={10}
                  defaultValue={existingRsvp?.additional_guests ?? 0}
                  className="max-w-32"
                />
              </div>

              {/* Which events */}
              <fieldset className="flex flex-col gap-3">
                <legend className="text-sm font-medium text-card-foreground mb-1">
                  Which events will you attend?
                </legend>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="attendingCeremony"
                    name="attendingCeremony"
                    defaultChecked={existingRsvp?.attending_ceremony ?? true}
                  />
                  <Label htmlFor="attendingCeremony" className="text-sm text-card-foreground cursor-pointer">
                    Matrimonial Ceremony (25th April)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="attendingTraditional"
                    name="attendingTraditional"
                    defaultChecked={existingRsvp?.attending_traditional ?? true}
                  />
                  <Label htmlFor="attendingTraditional" className="text-sm text-card-foreground cursor-pointer">
                    Traditional Wedding (26th April)
                  </Label>
                </div>
              </fieldset>
            </>
          )}

          {/* Message */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="message" className="text-sm text-card-foreground">
              Message to the couple (optional)
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Share your well wishes..."
              rows={3}
              defaultValue={existingRsvp?.message ?? ""}
            />
          </div>

          {state?.error && (
            <p className="text-destructive text-sm">{state.error}</p>
          )}

          <Button
            type="submit"
            disabled={isPending || !attending}
            className="bg-accent text-accent-foreground hover:bg-accent/90 py-5 tracking-wider uppercase text-sm"
          >
            {isPending
              ? "Submitting..."
              : existingRsvp
              ? "Update RSVP"
              : "Submit RSVP"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
