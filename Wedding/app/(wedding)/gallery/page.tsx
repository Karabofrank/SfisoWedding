import { getPhotos } from "@/app/actions";
import { PhotoUpload } from "@/components/photo-upload";
import { PhotoGrid } from "@/components/photo-grid";

export default async function GalleryPage() {
  const photos = await getPhotos();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-3xl md:text-4xl text-primary">
            Photo Gallery
          </h1>
          <p className="text-muted-foreground text-sm">
            Share and download photos from the celebration
          </p>
        </div>
        <PhotoUpload />
      </div>

      <PhotoGrid photos={photos} />
    </div>
  );
}
