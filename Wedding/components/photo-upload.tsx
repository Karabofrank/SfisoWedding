"use client";

import { useActionState, useId, useRef } from "react";
import { uploadPhoto } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function PhotoUpload() {
  const dialogId = useId();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (
      _prev: { error?: string; success?: boolean } | null,
      formData: FormData
    ) => {
      const result = await uploadPhoto(formData);
      if (result.success) {
        toast.success("Photo uploaded successfully!");
        formRef.current?.reset();
        router.refresh();
      }
      return result;
    },
    null
  );

  return (
    <Dialog>
      <DialogTrigger asChild id={dialogId}>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Upload className="h-4 w-4 mr-2" />
          Upload Photo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-primary">
            Share a Memory
          </DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="file" className="text-sm text-card-foreground">
              Select Photo
            </Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              required
              className="cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="caption" className="text-sm text-card-foreground">
              Caption (optional)
            </Label>
            <Input
              id="caption"
              name="caption"
              type="text"
              placeholder="Add a caption..."
            />
          </div>

          {state?.error && (
            <p className="text-destructive text-sm">{state.error}</p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isPending ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
