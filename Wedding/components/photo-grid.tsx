"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, User } from "lucide-react";

interface Photo {
  id: string;
  file_name: string;
  file_url: string;
  uploaded_by: string;
  caption: string | null;
  created_at: string;
}

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch {
      window.open(url, "_blank");
    }
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-16 flex flex-col items-center gap-3">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
          <Image
            src="/placeholder.svg"
            alt=""
            width={32}
            height={32}
            className="opacity-30"
          />
        </div>
        <p className="text-muted-foreground text-sm">
          No photos yet. Be the first to share a memory!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <Card key={photo.id} className="border-border bg-card overflow-hidden group">
          <div className="relative aspect-square">
            <Image
              src={photo.file_url}
              alt={photo.caption || "Wedding photo"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/30 transition-colors flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDownload(photo.file_url, photo.file_name)}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
          <CardContent className="p-3">
            {photo.caption && (
              <p className="text-sm text-card-foreground mb-1">{photo.caption}</p>
            )}
            <div className="flex items-center gap-1 text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="text-xs">{photo.uploaded_by}</span>
              <span className="text-xs ml-auto">
                {new Date(photo.created_at).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
