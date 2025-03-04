"use client";

import { useCallback, useState } from "react";

import Image from "next/image";

import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  defaultImage?: string;
  onImageChange: (imageData: string | null) => void;
}

export function ImageUpload({ defaultImage, onImageChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsLoading(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageChange(result);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    },
    [onImageChange],
  );

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative h-60 w-full">
          <Image
            src={preview}
            alt="Event banner"
            fill
            className="rounded-md object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 600px, 800px"
          />
        </div>
      ) : (
        <div className="bg-muted flex h-60 w-full items-center justify-center rounded-md">
          <span className="text-muted-foreground text-sm">Upload an image</span>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          {isLoading ? "Uploading..." : "Choose Image"}
        </Button>

        {preview && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              setPreview(null);
              onImageChange(null);
            }}
          >
            Remove
          </Button>
        )}

        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
