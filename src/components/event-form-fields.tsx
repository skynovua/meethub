"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toBase64 } from "@/utils/file";

export function EventFormFields() {
  const { control, watch, setValue } = useFormContext();
  const previewImage = watch("banner");
  const [isUploading, setIsUploading] = useState(false);

  const handleRemoveImage = () => {
    setValue("banner", "");
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          const fileBase64 = await toBase64(file);
          setValue("banner", fileBase64);
        }
      }
    } catch (error) {
      console.error("Error processing dropped file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="grid w-full items-center gap-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter the title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter the description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input type="datetime-local" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Enter the location" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="banner"
        render={({ field: { value, onChange, ...rest } }) => (
          <FormItem>
            <FormLabel>Banner Image</FormLabel>
            <FormControl>
              <div className="space-y-3">
                {/* Візуальний блок для drag&drop або кнопки */}
                <div
                  className={`rounded-lg border-2 border-dashed text-center transition-colors ${previewImage ? "border-transparent" : "border-muted hover:border-primary/50"}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {previewImage ? (
                    <div className="relative h-64 w-full">
                      <Image
                        src={previewImage}
                        alt="Banner Preview"
                        fill
                        className="rounded-md object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 600px, 800px"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <UploadIcon className="text-muted-foreground h-10 w-10" />
                        <p className="text-muted-foreground text-sm">
                          Drag and drop your image here or click to browse
                        </p>
                        <div className="mt-2">
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={isUploading}
                            onClick={() => document.getElementById("file-upload")?.click()}
                          >
                            {isUploading ? "Uploading..." : "Browse files"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Прихований інпут для вибору файлу */}
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                  {...rest}
                  onChange={async (event) => {
                    const files = event.target.files;
                    if (!files || !files.length) return;

                    setIsUploading(true);
                    try {
                      const fileBase64 = await toBase64(files[0]);
                      onChange(fileBase64);
                    } catch (error) {
                      console.error("Error converting file to base64:", error);
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
