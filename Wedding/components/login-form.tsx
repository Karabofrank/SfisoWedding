"use client";

import { useActionState } from "react";
import { loginWithInviteCode } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await loginWithInviteCode(formData);
    },
    null
  );

  return (
    <form action={formAction} className="w-full max-w-sm flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="guestName" className="text-cream/90 text-left text-sm">
          Your Name
        </Label>
        <Input
          id="guestName"
          name="guestName"
          type="text"
          placeholder="Enter your full name"
          required
          className="bg-cream/10 border-cream/30 text-cream placeholder:text-cream/50 focus:border-rose-gold focus:ring-rose-gold"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="inviteCode" className="text-cream/90 text-left text-sm">
          Invite Code
        </Label>
        <Input
          id="inviteCode"
          name="inviteCode"
          type="text"
          placeholder="Enter your invite code"
          required
          className="bg-cream/10 border-cream/30 text-cream placeholder:text-cream/50 focus:border-rose-gold focus:ring-rose-gold"
        />
      </div>

      {state?.error && (
        <p className="text-red-300 text-sm text-center">{state.error}</p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="bg-rose-gold text-cream hover:bg-rose-gold/90 font-sans tracking-wider uppercase text-sm py-5 mt-2"
      >
        {isPending ? "Entering..." : "Enter Celebration"}
      </Button>
    </form>
  );
}
